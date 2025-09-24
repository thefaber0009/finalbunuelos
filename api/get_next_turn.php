<?php
require_once '../config/config.php';
require_once '../includes/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input || !isset($input['queue_type'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing queue_type']);
    exit;
}

$queueType = $input['queue_type'];

if (!in_array($queueType, ['tradicionales', 'especiales', 'mixtos'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid queue_type']);
    exit;
}

try {
    $db = getDB();
    $pdo = $db->getConnection();
    
    $today = date('Y-m-d');
    
    $stmt = $pdo->prepare("
        SELECT COUNT(*) as order_count 
        FROM orders 
        WHERE queue_type = ? 
        AND DATE(created_at) = ?
    ");
    $stmt->execute([$queueType, $today]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $nextTurn = ($result['order_count'] ?? 0) + 1;
    
    echo json_encode([
        'success' => true,
        'turn_number' => $nextTurn,
        'queue_type' => $queueType,
        'date' => $today,
        'current_orders' => $result['order_count'] ?? 0
    ]);
    
} catch (Exception $e) {
    error_log("Error getting next turn: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error getting turn number: ' . $e->getMessage()
    ]);
}
?>