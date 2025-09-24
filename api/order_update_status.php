<?php
/**
 * API para actualizar estado de pedidos
 * Archivo: api/order_update_status.php
 */

require_once '../config/config.php';
require_once '../includes/auth.php';
require_once '../includes/db.php';

// Configurar headers para JSON
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

try {
    // Verificar autenticación
    Auth::requireAdmin();
    
    // Obtener datos JSON
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos JSON inválidos');
    }
    
    // Validar CSRF token
    if (!isset($input['csrf_token']) || !Auth::validateCSRFToken($input['csrf_token'])) {
        throw new Exception('Token CSRF inválido');
    }
    
    // Validar datos requeridos
    if (!isset($input['order_id']) || !isset($input['status'])) {
        throw new Exception('Faltan datos requeridos (order_id, status)');
    }
    
    $orderId = (int) $input['order_id'];
    $newStatus = trim($input['status']);
    
    // Validar ID del pedido
    if ($orderId <= 0) {
        throw new Exception('ID de pedido inválido');
    }
    
    // Validar estados permitidos
    $allowedStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!in_array($newStatus, $allowedStatuses)) {
        throw new Exception('Estado inválido. Permitidos: ' . implode(', ', $allowedStatuses));
    }
    
    // Conectar a la base de datos
    $db = getDB();
    
    // Verificar que el pedido existe y obtener su estado actual
    $checkStmt = $db->prepare("SELECT id, status, customer_name, total FROM orders WHERE id = ?");
    $checkStmt->execute([$orderId]);
    $order = $checkStmt->fetch();
    
    if (!$order) {
        throw new Exception('Pedido no encontrado');
    }
    
    $currentStatus = $order['status'];
    
    // Validar transiciones de estado permitidas
    $validTransitions = [
        'pending' => ['preparing', 'cancelled'],
        'preparing' => ['ready', 'cancelled'],
        'ready' => ['delivered', 'cancelled'],
        'delivered' => [], // Estado final
        'cancelled' => [] // Estado final
    ];
    
    if (!in_array($newStatus, $validTransitions[$currentStatus])) {
        throw new Exception("Transición de estado inválida de '$currentStatus' a '$newStatus'");
    }
    
    // Iniciar transacción
    $db->beginTransaction();
    
    try {
        // Actualizar estado del pedido
        $updateStmt = $db->prepare("
            UPDATE orders 
            SET status = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        ");
        
        $result = $updateStmt->execute([$newStatus, $orderId]);
        
        if (!$result || $updateStmt->rowCount() === 0) {
            throw new Exception('Error al actualizar el estado del pedido');
        }
        
        // Registrar en historial de cambios (si existe tabla de auditoría)
        try {
            $historyStmt = $db->prepare("
                INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, changed_at)
                VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ");
            $historyStmt->execute([
                $orderId, 
                $currentStatus, 
                $newStatus, 
                Auth::getCurrentUser()['id']
            ]);
        } catch (PDOException $e) {
            // Si no existe la tabla de historial, continuar sin error
            error_log("Order history table not found: " . $e->getMessage());
        }
        
        // Confirmar transacción
        $db->commit();
        
        // Registrar la acción en logs
        error_log("Order status updated - Order ID: $orderId, Status: $currentStatus -> $newStatus, User: " . Auth::getCurrentUser()['username']);
        
        // Respuesta exitosa
        echo json_encode([
            'success' => true,
            'message' => 'Estado del pedido actualizado correctamente',
            'data' => [
                'order_id' => $orderId,
                'old_status' => $currentStatus,
                'new_status' => $newStatus,
                'customer_name' => $order['customer_name'],
                'total' => $order['total'],
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ]);
        
    } catch (Exception $e) {
        // Revertir transacción
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    // Log del error
    error_log("Update order status error: " . $e->getMessage());
    
    // Respuesta de error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
} catch (PDOException $e) {
    // Error de base de datos
    error_log("Database error in order_update_status: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de base de datos'
    ]);
    
} catch (Throwable $e) {
    // Error inesperado
    error_log("Unexpected error in order_update_status: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor'
    ]);
}