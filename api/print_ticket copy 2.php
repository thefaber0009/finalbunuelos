<?php
require_once '../config/config.php';
require_once '../includes/auth.php';
require_once '../includes/db.php';
require_once '../includes/helpers.php';
require_once '../includes/thermal_printer.php';

header('Content-Type: application/json');

// Require admin access
Auth::requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse('Method not allowed', 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    errorResponse('Invalid JSON data');
}

// Validate CSRF token
if (!Auth::validateCSRF($input['csrf_token'] ?? '')) {
    errorResponse('Invalid security token', 403);
}

$action = $input['action'] ?? '';
$orderId = (int)($input['order_id'] ?? 0);

try {
    $db = getDB();
    
    // Configuración de la impresora (ajustar según tu setup)
$printer = new ThermalPrinter("POS-80C"); // nombre compartido de tu impresora

    
    $printer = new ThermalPrinter(
        $printerConfig['type'],
        $printerConfig['device'],
        $printerConfig['ip'],
        $printerConfig['port']
    );
    
    switch ($action) {
        case 'print_order':
            if ($orderId <= 0) {
                errorResponse('Invalid order ID');
            }
            
            // Obtener datos completos del pedido
            $stmt = $db->prepare("
                SELECT o.*, d.phone, d.address, d.neighborhood, d.delivery_references 
                FROM orders o 
                LEFT JOIN deliveries d ON o.id = d.order_id 
                WHERE o.id = ?
            ");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            
            if (!$order) {
                errorResponse('Order not found');
            }
            
            // Obtener items del pedido
            $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
            $stmt->execute([$orderId]);
            $items = $stmt->fetchAll();
            
            $orderData = [
                'order_code' => $order['order_code'],
                'customer_name' => $order['customer_name'],
                'order_type' => $order['order_type'],
                'queue_type' => $order['queue_type'],
                'status' => $order['status'],
                'total' => $order['total'],
                'items' => $items,
                'delivery' => $order['order_type'] === 'delivery' ? [
                    'phone' => $order['phone'],
                    'address' => $order['address'],
                    'neighborhood' => $order['neighborhood'],
                    'delivery_references' => $order['delivery_references']
                ] : null
            ];
            
            $result = $printer->printOrderTicket($orderData);
            
            if ($result['success']) {
                successResponse(['message' => $result['message']]);
            } else {
                errorResponse($result['error']);
            }
            break;
            
        case 'test_printer':
            $result = $printer->testConnection();
            
            if ($result['success']) {
                successResponse(['message' => $result['message']]);
            } else {
                errorResponse($result['error']);
            }
            break;
            
        case 'daily_report':
            // Obtener estadísticas del día
            $today = date('Y-m-d');
            $statsStmt = $db->prepare("
                SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                    SUM(CASE WHEN status = 'preparing' THEN 1 ELSE 0 END) as preparing_orders,
                    SUM(CASE WHEN status = 'ready' THEN 1 ELSE 0 END) as ready_orders,
                    SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders,
                    SUM(CASE WHEN substr(created_at, 1, 10) = ? THEN total ELSE 0 END) as today_revenue
                FROM orders 
                WHERE substr(created_at, 1, 10) = ?
            ");
            $statsStmt->execute([$today, $today]);
            $stats = $statsStmt->fetch();
            
            $result = $printer->printDailySalesReport($stats, $today);
            
            if ($result['success']) {
                successResponse(['message' => $result['message']]);
            } else {
                errorResponse($result['error']);
            }
            break;
            
        default:
            errorResponse('Invalid action');
    }
    
} catch (Exception $e) {
    error_log("Print error: " . $e->getMessage());
    errorResponse('Print error: ' . $e->getMessage());
}
?>