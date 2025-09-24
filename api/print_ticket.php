<?php
/**
 * API para sistema de impresión JALPOS80U
 * Archivo: api/print_ticket.php
 */

require_once '../config/config.php';
require_once '../includes/auth.php';
require_once '../includes/db.php';
require_once '../includes/helpers.php';

// Configurar headers para JSON
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

class PrinterManager {
    private $printerPath;
    private $printerName;
    
    public function __construct() {
        // Configuración de impresora - ajustar según sistema
        $this->printerName = 'JALPOS80U';
        
        // Detectar sistema operativo
        if (PHP_OS_FAMILY === 'Windows') {
            $this->printerPath = 'print /D:' . $this->printerName . ' ';
        } else {
            // Linux/Mac - ajustar según configuración
            $this->printerPath = 'lp -d ' . $this->printerName . ' ';
        }
    }
    
    public function testConnection() {
        try {
            // Crear archivo temporal con texto de prueba
            $testContent = $this->generateTestTicket();
            $tempFile = tempnam(sys_get_temp_dir(), 'printer_test_');
            file_put_contents($tempFile, $testContent);
            
            // Intentar imprimir
            $command = $this->printerPath . escapeshellarg($tempFile);
            $output = [];
            $returnCode = 0;
            
            exec($command . ' 2>&1', $output, $returnCode);
            
            // Limpiar archivo temporal
            unlink($tempFile);
            
            if ($returnCode === 0) {
                return ['success' => true, 'message' => 'Impresora conectada correctamente'];
            } else {
                throw new Exception('Error de impresora: ' . implode(' ', $output));
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function printOrder($orderId) {
        try {
            $db = getDB();
            
            // Obtener datos del pedido
            $orderStmt = $db->prepare("
                SELECT o.*, d.address, d.phone as delivery_phone
                FROM orders o 
                LEFT JOIN deliveries d ON o.id = d.order_id 
                WHERE o.id = ?
            ");
            $orderStmt->execute([$orderId]);
            $order = $orderStmt->fetch();
            
            if (!$order) {
                throw new Exception('Pedido no encontrado');
            }
            
            // Obtener items del pedido
            $itemsStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $itemsStmt->execute([$orderId]);
            $items = $itemsStmt->fetchAll();
            
            // Generar contenido del ticket
            $ticketContent = $this->generateOrderTicket($order, $items);
            
            // Crear archivo temporal
            $tempFile = tempnam(sys_get_temp_dir(), 'order_ticket_');
            file_put_contents($tempFile, $ticketContent);
            
            // Imprimir
            $command = $this->printerPath . escapeshellarg($tempFile);
            $output = [];
            $returnCode = 0;
            
            exec($command . ' 2>&1', $output, $returnCode);
            
            // Limpiar archivo temporal
            unlink($tempFile);
            
            if ($returnCode === 0) {
                return ['success' => true, 'message' => 'Ticket impreso correctamente'];
            } else {
                throw new Exception('Error imprimiendo ticket: ' . implode(' ', $output));
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    public function printDailyReport() {
        try {
            $db = getDB();
            $today = date('Y-m-d');
            
            // Obtener estadísticas del día
            $statsStmt = $db->prepare("
                SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                    SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparing_orders,
                    SUM(CASE WHEN status = 'ready' THEN 1 ELSE 0 END) as ready_orders,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                    SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
                    SUM(CASE WHEN status = 'delivered' THEN total ELSE 0 END) as total_revenue,
                    AVG(CASE WHEN status = 'delivered' THEN total ELSE NULL END) as avg_order_value
                FROM orders 
                WHERE DATE(created_at) = ?
            ");
            $statsStmt->execute([$today]);
            $stats = $statsStmt->fetch();
            
            // Obtener pedidos del día
            $ordersStmt = $db->prepare("
                SELECT order_code, customer_name, status, total, created_at
                FROM orders 
                WHERE DATE(created_at) = ?
                ORDER BY created_at DESC
            ");
            $ordersStmt->execute([$today]);
            $orders = $ordersStmt->fetchAll();
            
            // Generar contenido del reporte
            $reportContent = $this->generateDailyReport($stats, $orders, $today);
            
            // Crear archivo temporal
            $tempFile = tempnam(sys_get_temp_dir(), 'daily_report_');
            file_put_contents($tempFile, $reportContent);
            
            // Imprimir
            $command = $this->printerPath . escapeshellarg($tempFile);
            $output = [];
            $returnCode = 0;
            
            exec($command . ' 2>&1', $output, $returnCode);
            
            // Limpiar archivo temporal
            unlink($tempFile);
            
            if ($returnCode === 0) {
                return ['success' => true, 'message' => 'Reporte impreso correctamente'];
            } else {
                throw new Exception('Error imprimiendo reporte: ' . implode(' ', $output));
            }
            
        } catch (Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }
    
    private function generateTestTicket() {
        return "
================================
    EL REY DE LOS BUÑUELOS
================================
PRUEBA DE IMPRESORA
--------------------------------
Fecha: " . date('Y-m-d H:i:s') . "
Estado: FUNCIONANDO CORRECTAMENTE
--------------------------------
Esta es una prueba de conectividad
de la impresora JALPOS80U.

Si puede leer este texto, la
impresora está funcionando bien.
================================
        ";
    }
    
    private function generateOrderTicket($order, $items) {
        $ticket = "
================================
    EL REY DE LOS BUÑUELOS
================================
TICKET DE PEDIDO
--------------------------------
Pedido: #" . $order['order_code'] . "
Cliente: " . $order['customer_name'] . "
Fecha: " . date('Y-m-d H:i:s', strtotime($order['created_at'])) . "
Tipo: " . ($order['order_type'] === 'physical' ? 'EN LOCAL' : 'DOMICILIO') . "
Cola: " . strtoupper($order['queue_type']) . "
";

        if ($order['address']) {
            $ticket .= "Dirección: " . $order['address'] . "\n";
        }

        if ($order['delivery_phone']) {
            $ticket .= "Teléfono: " . $order['delivery_phone'] . "\n";
        }

        $ticket .= "
--------------------------------
PRODUCTOS:
";

        foreach ($items as $item) {
            $ticket .= sprintf("%-20s %2dx %8s\n", 
                substr($item['name'], 0, 20),
                $item['quantity'],
                formatCurrency($item['subtotal'])
            );
        }

        $ticket .= "
--------------------------------
TOTAL: " . formatCurrency($order['total']) . "
Estado: " . strtoupper($order['status']) . "
Pago: " . strtoupper($order['payment_status'] ?? 'PENDIENTE') . "
================================
¡Gracias por su compra!
        ";
        
        return $ticket;
    }
    
    private function generateDailyReport($stats, $orders, $date) {
        $report = "
================================
    EL REY DE LOS BUÑUELOS
================================
REPORTE DIARIO
--------------------------------
Fecha: " . date('d/m/Y', strtotime($date)) . "
Hora: " . date('H:i:s') . "
--------------------------------
RESUMEN:
Total Pedidos: " . $stats['total_orders'] . "
Pendientes: " . $stats['pending_orders'] . "
En Preparación: " . $stats['preparing_orders'] . "
Listos: " . $stats['ready_orders'] . "
Entregados: " . $stats['delivered_orders'] . "
Cancelados: " . $stats['cancelled_orders'] . "
--------------------------------
INGRESOS:
Total: " . formatCurrency($stats['total_revenue']) . "
Promedio/Pedido: " . formatCurrency($stats['avg_order_value']) . "
--------------------------------
DETALLE DE PEDIDOS:
";

        foreach ($orders as $order) {
            $report .= sprintf("#%-8s %-15s %8s %s\n",
                $order['order_code'],
                substr($order['customer_name'], 0, 15),
                formatCurrency($order['total']),
                strtoupper($order['status'])
            );
        }

        $report .= "
================================
Generado automáticamente
        ";
        
        return $report;
    }
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
    
    // Validar acción requerida
    if (!isset($input['action'])) {
        throw new Exception('Acción no especificada');
    }
    
    $action = $input['action'];
    $printer = new PrinterManager();
    
    switch ($action) {
        case 'test_printer':
            $result = $printer->testConnection();
            break;
            
        case 'print_order':
            if (!isset($input['order_id'])) {
                throw new Exception('ID de pedido requerido');
            }
            $orderId = (int) $input['order_id'];
            if ($orderId <= 0) {
                throw new Exception('ID de pedido inválido');
            }
            $result = $printer->printOrder($orderId);
            break;
            
        case 'daily_report':
            $result = $printer->printDailyReport();
            break;
            
        default:
            throw new Exception('Acción no válida');
    }
    
    // Registrar en logs
    error_log("Printer action executed - Action: $action, User: " . Auth::getCurrentUser()['username']);
    
    // Responder con el resultado
    if ($result['success']) {
        echo json_encode([
            'success' => true,
            'message' => $result['message']
        ]);
    } else {
        throw new Exception($result['error']);
    }
    
} catch (Exception $e) {
    // Log del error
    error_log("Print ticket error: " . $e->getMessage());
    
    // Respuesta de error
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
    
} catch (PDOException $e) {
    // Error de base de datos
    error_log("Database error in print_ticket: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de base de datos'
    ]);
    
} catch (Throwable $e) {
    // Error inesperado
    error_log("Unexpected error in print_ticket: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error interno del servidor'
    ]);
}