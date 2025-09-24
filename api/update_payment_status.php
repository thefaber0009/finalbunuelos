<?php
/**
 * API para actualizar estado de pago
 * Archivo: api/update_payment_status.php
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
    if (!isset($input['order_id']) || !isset($input['payment_status'])) {
        throw new Exception('Faltan datos requeridos (order_id, payment_status)');
    }
    
    $orderId = (int) $input['order_id'];
    $paymentStatus = trim($input['payment_status']);
    
    // Validar ID del pedido
    if ($orderId <= 0) {
        throw new Exception('ID de pedido inválido');
    }
    
    // Validar estados de pago permitidos
    $allowedStatuses = ['pending', 'paid', 'failed'];
    if (!in_array($paymentStatus, $allowedStatuses)) {
        throw new Exception('Estado de pago inválido. Permitidos: ' . implode(', ', $allowedStatuses));
    }
    
    // Conectar a la base de datos
    $db = getDB();
    
    // Verificar que el pedido existe
    $checkStmt = $db->prepare("SELECT id, customer_name, total FROM orders WHERE id = ?");
    $checkStmt->execute([$orderId]);
    $order = $checkStmt->fetch();
    
    if (!$order) {
        throw new Exception('Pedido no encontrado');
    }
    
    // Actualizar estado de pago
    $updateStmt = $db->prepare("
        UPDATE orders 
        SET payment_status = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    ");
    
    $result = $updateStmt->execute([$paymentStatus, $orderId]);
    
    if (!$result) {
        throw new Exception('Error al actualizar el estado de pago');
    }
    
    // Verificar que se actualizó correctamente
    if ($updateStmt->rowCount() === 0) {
        throw new Exception('No se pudo actualizar el pedido. Verifique el ID');
    }
    
    // Registrar la acción en logs (opcional)
    error_log("Payment status updated - Order ID: $orderId, New Status: $paymentStatus, User: " . Auth::getCurrentUser()['username']);
    
    // Respuesta exitosa
    echo json_encode([
        'success' => true,
        'message' => 'Estado de pago actualizado correctamente',
        'data' => [
            'order_id' => $orderId,
            'payment_status' => $paymentStatus,
            'customer_name' => $order['customer_name'],
            'total' => $order['total'],
            'updated_at' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    // Log del error
    error_log("Update payment status error: " . $e->getMessage());
    
    // Respuesta de error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
} catch (PDOException $e) {
    // Error de base de datos
    error_log("Database error in update_payment_status: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de base de datos'
    ]);
    
} catch (Throwable $e) {
    // Error inesperado
    error_log("Unexpected error in update_payment_status: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor'
    ]);
}