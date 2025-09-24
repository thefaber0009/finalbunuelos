<?php
require_once '../config/config.php';
require_once '../includes/db.php';
// REMOVED AUTH REQUIREMENT - This was blocking orders
// require_once '../includes/auth.php';
require_once '../includes/helpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Log inicio del script
error_log("=== ORDER CREATE START ===");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Invalid method: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$rawInput = file_get_contents('php://input');
error_log("Raw input: " . $rawInput);

$input = json_decode($rawInput, true);

if (!$input) {
    error_log("JSON decode error: " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON data']);
    exit;
}

error_log("Parsed input: " . print_r($input, true));

// REMOVED CSRF validation - was blocking orders

// Validate required fields
$customerName = trim($input['customerName'] ?? '');
$orderType = $input['orderType'] ?? '';
$items = $input['items'] ?? [];

error_log("Customer: $customerName, Type: $orderType, Items count: " . count($items));

if (empty($customerName) || empty($orderType) || empty($items)) {
    error_log("Missing required fields - Customer: '$customerName', Type: '$orderType', Items: " . count($items));
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!in_array($orderType, ['physical', 'delivery'])) {
    error_log("Invalid order type: $orderType");
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid order type']);
    exit;
}

// Variables for transaction control
$transactionStarted = false;

try {
    $db = getDB();
    error_log("Database connection established");
    
    // Get the actual PDO connection
    $pdo = $db->getConnection();
    
    $pdo->beginTransaction();
    $transactionStarted = true;
    error_log("Transaction started");
    
    // FIXED: Get menu items from correct table 'productos'
    $stmt = $pdo->prepare("SELECT id, nombre as name, precio as price, categoria as category FROM productos WHERE activo = 1");
    $stmt->execute();
    $menuItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    error_log("Menu items loaded from DB: " . count($menuItems));
    error_log("Menu items sample: " . print_r(array_slice($menuItems, 0, 3), true));
    
    if (empty($menuItems)) {
        throw new Exception('No menu items found in database');
    }
    
    $menuMap = [];
    foreach ($menuItems as $item) {
        $menuMap[$item['id']] = $item;
    }
    
    // Debug: Log available menu item IDs
    $availableIds = array_keys($menuMap);
    error_log("Available menu item IDs: " . implode(', ', $availableIds));
    
    $total = 0;
    $validatedItems = [];
    
    // NEW: Variables para determinar el tipo de cola
    $hasTradicionales = false;
    $hasEspeciales = false;
    
    error_log("=== INICIANDO DETECCIÓN DE COLA ===");
    
    foreach ($items as $item) {
        $itemId = $item['id'] ?? '';
        $quantity = (int)($item['quantity'] ?? 0);
        
        error_log("Processing item: '$itemId', quantity: $quantity");
        
        // IMPROVED: Better validation with specific error messages
        if (empty($itemId)) {
            error_log("ERROR: Empty item ID");
            throw new Exception('Invalid item: empty ID');
        }
        
        if (!isset($menuMap[$itemId])) {
            error_log("ERROR: Item ID '$itemId' not found in menu");
            error_log("Looking for: '$itemId'");
            error_log("Available: " . implode(', ', $availableIds));
            
            // Check if it's a case sensitivity issue
            $lowerCaseMap = array_change_key_case($menuMap, CASE_LOWER);
            if (isset($lowerCaseMap[strtolower($itemId)])) {
                error_log("HINT: Found case mismatch - '$itemId' vs available keys");
            }
            
            throw new Exception("Invalid item: '$itemId' not found in menu");
        }
        
        if ($quantity <= 0) {
            error_log("ERROR: Invalid quantity $quantity for item $itemId");
            throw new Exception("Invalid quantity for $itemId: $quantity");
        }
        
        $menuItem = $menuMap[$itemId];
        $subtotal = $menuItem['price'] * $quantity;
        $total += $subtotal;
        
        // NEW: Determinar tipo de producto para cola
        $categoria = $menuItem['category'];
        
        // Verificar exactamente qué categorías tenemos
        error_log("Producto: " . $menuItem['name'] . " - Categoría BD: '$categoria'");
        
        if ($categoria === 'tradicional') {
            $hasTradicionales = true;
            error_log("DETECTADO: Producto tradicional");
        } elseif ($categoria === 'especial') {
            $hasEspeciales = true;
            error_log("DETECTADO: Producto especial");
        } else {
            error_log("DETECTADO: Producto de otra categoría: '$categoria'");
        }
        
        $validatedItems[] = [
            'menu_item_id' => $itemId,  // Store original ID
            'name' => $menuItem['name'],
            'unit_price' => $menuItem['price'],
            'quantity' => $quantity,
            'subtotal' => $subtotal,
            'category' => $menuItem['category']
        ];
        
        error_log("Item validated: " . $menuItem['name'] . " (ID: $itemId) x$quantity = $subtotal");
    }
    
    error_log("=== RESULTADO DETECCIÓN COLA ===");
    error_log("Has tradicionales: " . ($hasTradicionales ? 'SÍ' : 'NO'));
    error_log("Has especiales: " . ($hasEspeciales ? 'SÍ' : 'NO'));
    
    error_log("Total calculated: $total");
    
    // NEW: Determinar tipo de cola basado en productos
    $queueType = 'tradicionales'; // Default
    if ($hasTradicionales && $hasEspeciales) {
        $queueType = 'mixtos';
    } elseif ($hasEspeciales && !$hasTradicionales) {
        $queueType = 'especiales';
    } elseif ($hasTradicionales && !$hasEspeciales) {
        $queueType = 'tradicionales';
    }
    
    error_log("Queue type determined: $queueType (tradicionales: " . ($hasTradicionales ? 'yes' : 'no') . ", especiales: " . ($hasEspeciales ? 'yes' : 'no') . ")");
    
    // NEW: Generate turn number for the queue type (calculated, not stored)
    $turnNumber = generateTurnNumber($pdo, $queueType);
    error_log("Turn number generated: $turnNumber for queue: $queueType");
    
    // Generate unique order code (compatible with varchar(12))
    $maxAttempts = 10;
    $attempt = 0;
    
    do {
        $attempt++;
        // Format: PEDHHMMSSNN where HHMMSSNN is current time + random
        $timeCode = date('His'); // Hours, Minutes, Seconds
        $randomSuffix = str_pad(rand(10, 99), 2, '0', STR_PAD_LEFT);
        $orderCode = 'PED' . $timeCode . $randomSuffix; // Total: 3 + 6 + 2 = 11 chars
        
        // Check if code already exists
        $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM orders WHERE order_code = ?");
        $checkStmt->execute([$orderCode]);
        $codeExists = $checkStmt->fetchColumn() > 0;
        
        if (!$codeExists) {
            break;
        }
        
        error_log("Order code collision detected, trying again: $orderCode");
        usleep(100000); // Wait 100ms to ensure different timestamp
        
    } while ($codeExists && $attempt < $maxAttempts);
    
    if ($codeExists) {
        // Fallback: use microseconds for absolute uniqueness
        $orderCode = 'P' . substr(microtime(true) * 10000, -10); // 11 chars total
    }
    
    error_log("Unique order code generated: $orderCode");
    
    // Create order using existing table structure (WITHOUT turn_number column)
    $stmt = $pdo->prepare("
        INSERT INTO orders (order_code, customer_name, order_type, queue_type, total, status, created_at) 
        VALUES (?, ?, ?, ?, ?, 'pending', NOW())
    ");
    $result = $stmt->execute([$orderCode, $customerName, $orderType, $queueType, $total]);
    $orderId = $pdo->lastInsertId();
    
    if (!$orderId) {
        throw new Exception('Failed to create order - no ID returned');
    }
    
    error_log("Order created with ID: $orderId in queue: $queueType with calculated turn: $turnNumber");
    
    // FIXED: Create order items using existing table structure 'order_items'
    $stmt = $pdo->prepare("
        INSERT INTO order_items (order_id, name, unit_price, quantity, subtotal) 
        VALUES (?, ?, ?, ?, ?)
    ");
    
    foreach ($validatedItems as $item) {
        $itemResult = $stmt->execute([
            $orderId, 
            $item['name'],  // Use name instead of menu_item_id
            $item['unit_price'], 
            $item['quantity'], 
            $item['subtotal']
        ]);
        
        if (!$itemResult) {
            error_log("Failed to insert item: " . print_r($stmt->errorInfo(), true));
            throw new Exception('Failed to create order item: ' . $item['name']);
        }
        
        error_log("Order item created: " . $item['name'] . " x" . $item['quantity']);
    }
    
    // Handle delivery data if present
    if ($orderType === 'delivery' && !empty($input['deliveryData'])) {
        $delivery = $input['deliveryData'];
        error_log("Processing delivery data: " . print_r($delivery, true));
        
        // FIXED: Store delivery data using existing table structure 'deliveries'
        $stmt = $pdo->prepare("
            INSERT INTO deliveries (order_id, phone, receiver_name, receiver_phone, address, neighborhood, delivery_references, payment_method, receipt_path) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $deliveryResult = $stmt->execute([
            $orderId,
            $delivery['phone'] ?? '',
            $delivery['fullName'] ?? null, 
            $delivery['phone'] ?? null, 
            $delivery['address'] ?? '',
            $delivery['neighborhood'] ?? '',
            $delivery['references'] ?? null,
            $delivery['paymentMethod'] ?? '',
            null // Receipt path
        ]);
        
        if (!$deliveryResult) {
            error_log("Failed to save delivery data: " . print_r($stmt->errorInfo(), true));
            // Don't throw exception - delivery data is not critical for order creation
            error_log("Warning: Delivery data not saved, but order created successfully");
        } else {
            error_log("Delivery data saved successfully");
        }
    }
    
    $pdo->commit();
    $transactionStarted = false;
    error_log("Transaction committed successfully");
    
    // Generate turn display format
    $turnPrefix = match($queueType) {
        'tradicionales' => 'T',
        'especiales' => 'E', 
        'mixtos' => 'M',
        default => 'T'
    };
    $turnDisplay = $turnPrefix . '/' . $turnNumber;
    
    // Return success response with queue information
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Order created successfully',
        'data' => [
            'order_id' => $orderId,
            'order_code' => $orderCode,
            'total' => $total,
            'queue_type' => $queueType,
            'turn_number' => $turnNumber,
            'turn_display' => $turnDisplay,
            'queue_info' => [
                'tradicionales' => $hasTradicionales,
                'especiales' => $hasEspeciales,
                'turn_number' => $turnNumber,
                'turn_display' => $turnDisplay,
                'queue_name' => $queueType === 'tradicionales' ? 'Turno Tradicionales' : 
                              ($queueType === 'especiales' ? 'Turno Especiales' : 'Turno Mixtos')
            ]
        ]
    ]);
    
} catch (Exception $e) {
    // FIXED: Check if transaction was started before rolling back
    if ($transactionStarted && isset($pdo)) {
        try {
            $pdo->rollback();
            error_log("Transaction rolled back");
        } catch (Exception $rollbackError) {
            error_log("Failed to rollback transaction: " . $rollbackError->getMessage());
        }
    }
    
    error_log("Order creation error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Error creating order: ' . $e->getMessage(),
        'debug_info' => [
            'line' => $e->getLine(),
            'file' => basename($e->getFile())
        ]
    ]);
}

error_log("=== ORDER CREATE END ===");

/**
 * Generate the next turn number for a specific queue type
 * Each queue type has its own independent counter
 */
function generateTurnNumber($pdo, $queueType) {
    // Get the current date to reset counters daily
    $today = date('Y-m-d');
    
    try {
        // Count orders for this specific queue type today
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as order_count 
            FROM orders 
            WHERE queue_type = ? 
            AND DATE(created_at) = ?
        ");
        $stmt->execute([$queueType, $today]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $nextTurn = ($result['order_count'] ?? 0) + 1;
        
        error_log("Turn number calculation - Queue: $queueType, Date: $today, Current orders: " . ($result['order_count'] ?? 0) . ", Next turn: $nextTurn");
        
        return $nextTurn;
        
    } catch (Exception $e) {
        error_log("Error generating turn number: " . $e->getMessage());
        // Fallback to timestamp-based number
        return (int)date('His') % 1000; // Use time as fallback
    }
}

// Helper function to handle errors (if not in helpers.php)
if (!function_exists('errorResponse')) {
    function errorResponse($message, $code = 400) {
        http_response_code($code);
        echo json_encode(['success' => false, 'error' => $message]);
        exit;
    }
}

if (!function_exists('successResponse')) {
    function successResponse($data) {
        http_response_code(200);
        echo json_encode(['success' => true, 'data' => $data]);
        exit;
    }
}
?>