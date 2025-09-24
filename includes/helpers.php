<?php
// ===== ACTUALIZADO: includes/helpers.php =====

/**
 * Helper functions for the Buñuelos ordering system
 */

/**
 * Escape HTML output to prevent XSS
 */
function e($value) {
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/**
 * Format currency for Colombian Pesos
 */
function formatCurrency($amount) {
    // Los precios en el sistema deberían estar en pesos, no en centavos
    // Para buñuelos: 1500 = $1.500 COP, 2000 = $2.000 COP, etc.
    
    // Asegurar que sea un número
    $amount = floatval($amount);
    
    // Para sistema de buñuelos, los valores deben estar ya en pesos
    // 1500 -> $1.500 COP
    // 2000 -> $2.000 COP
    return '$' . number_format($amount, 0, ',', '.') . ' COP';
}

// FUNCIÓN ALTERNATIVA SI TIENES VALORES EN CENTAVOS:
function formatCurrencyFromCents($amountInCents) {
    $amountInPesos = $amountInCents / 100;
    return '$' . number_format($amountInPesos, 0, ',', '.') . ' COP';
}

// FUNCIÓN DE PRUEBA PARA VERIFICAR QUÉ FORMATO USAR:
function debugCurrency($amount) {
    echo "Valor original: {$amount}<br>";
    echo "Como pesos: " . formatCurrency($amount) . "<br>";
    echo "Como centavos: " . formatCurrencyFromCents($amount) . "<br>";
    echo "---<br>";
}

/**
 * Generate a unique order code
 */
function generateOrderCode() {
    return strtoupper(substr(uniqid(), -8));
}

/**
 * Get menu items (hardcoded for now)
 */
function getMenuItems() {
    return [
        [
            'id' => 'bunuelo-clasico',
            'name' => 'Buñuelo Clásico',
            'description' => 'Buñuelo tradicional, dorado y crujiente',
            'price' => 1500,
            'category' => 'traditional'
        ],
        [
            'id' => 'bunuelo-azucar',
            'name' => 'Buñuelo con Azúcar',
            'description' => 'Buñuelo tradicional espolvoreado con azúcar',
            'price' => 2000,
            'category' => 'traditional'
        ],
        [
            'id' => 'bunuelo-queso',
            'name' => 'Buñuelo de Queso Mozarella',
            'description' => 'Relleno con queso mozarella derretido',
            'price' => 2500,
            'category' => 'traditional'
        ],
        [
            'id' => 'bunuelo-hawaiano',
            'name' => 'Buñuelo Hawaiano',
            'description' => 'Con piña y jamón, sabor tropical único',
            'price' => 3000,
            'category' => 'special'
        ],
        [
            'id' => 'bunuelo-ranchero',
            'name' => 'Buñuelo Ranchero',
            'description' => 'Con frijoles, chorizo y queso campesino',
            'price' => 3000,
            'category' => 'special'
        ],
        [
            'id' => 'bunuelo-mermelada',
            'name' => 'Buñuelo de Mermelada',
            'description' => 'Relleno con mermelada de frutas',
            'price' => 2000,
            'category' => 'traditional'
        ],
        [
            'id' => 'bunuelo-bocadillo',
            'name' => 'Buñuelo de Bocadillo',
            'description' => 'Con dulce de guayaba tradicional',
            'price' => 2000,
            'category' => 'traditional'
        ],
        [
            'id' => 'bunuelo-arequipe',
            'name' => 'Buñuelo de Arequipe',
            'description' => 'Relleno con arequipe cremoso',
            'price' => 2000,
            'category' => 'traditional'
        ]
    ];
}

/**
 * Determine queue type based on items
 */
function determineQueueType($items) {
    $hasTraditional = false;
    $hasSpecial = false;
    
    foreach ($items as $item) {
        if ($item['category'] === 'traditional') {
            $hasTraditional = true;
        } elseif ($item['category'] === 'special') {
            $hasSpecial = true;
        }
    }
    
    if ($hasTraditional && $hasSpecial) {
        return 'mixtos';
    } elseif ($hasSpecial) {
        return 'especiales';
    } else {
        return 'tradicionales';
    }
}

/**
 * Send JSON success response
 */
function successResponse($data = null) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    exit;
}

/**
 * Send JSON error response
 */
function errorResponse($message, $code = 400) {
    http_response_code($code);
    echo json_encode([
        'success' => false,
        'error' => $message
    ]);
    exit;
}

/**
 * Validate Colombian phone number
 */
function validatePhone($phone) {
    // Remove spaces and common separators
    $phone = preg_replace('/[\s\-\(\)]/', '', $phone);
    
    // Colombian mobile: 10 digits starting with 3
    // Colombian landline: 7-8 digits (with area code: 10 digits)
    return preg_match('/^[3][0-9]{9}$/', $phone) || preg_match('/^[1-8][0-9]{6,9}$/', $phone);
}

/**
 * Sanitize address input
 */
function sanitizeAddress($address) {
    return trim(preg_replace('/\s+/', ' ', $address));
}

/**
 * Get order status display text
 */
function getOrderStatusText($status) {
    $statusTexts = [
        'pending' => 'Pendiente',
        'preparing' => 'En Preparación',
        'ready' => 'Listo',
        'delivered' => 'Entregado'
    ];
    
    return $statusTexts[$status] ?? 'Desconocido';
}

/**
 * Get order type display text
 */
function getOrderTypeText($type) {
    $typeTexts = [
        'physical' => 'En Local',
        'delivery' => 'A Domicilio'
    ];
    
    return $typeTexts[$type] ?? 'Desconocido';
}

/**
 * Get queue type display text
 */
function getQueueTypeText($type) {
    $typeTexts = [
        'tradicionales' => 'Cola Tradicionales',
        'especiales' => 'Cola Especiales',
        'mixtos' => 'Cola Mixtos'
    ];
    
    return $typeTexts[$type] ?? 'Cola General';
}

/**
 * Validate email address
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Generate random string
 */
function generateRandomString($length = 8) {
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

/**
 * Log order activity
 */
function logActivity($message, $orderId = null) {
    $logMessage = date('Y-m-d H:i:s') . " - ";
    if ($orderId) {
        $logMessage .= "Order #{$orderId} - ";
    }
    $logMessage .= $message;
    
    error_log($logMessage);
}

/**
 * Check if database tables exist and create them if needed (SQLite specific)
 */
function ensureDatabaseTables() {
    if (DB_TYPE !== 'sqlite') {
        return; // Only for SQLite
    }
    
    try {
        $db = getDB();
        
        // Check if orders table exists
        $result = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='orders'");
        if ($result->fetch() === false) {
            error_log("Creating database tables...");
            createSQLiteTables($db);
        }
    } catch (Exception $e) {
        error_log("Error checking/creating tables: " . $e->getMessage());
    }
}

/**
 * Get payment status display text
 */
function getPaymentStatusText($status) {
    $statusTexts = [
        'pending' => 'Pendiente',
        'paid' => 'Pagado',
        'failed' => 'Falló'
    ];
    
    return $statusTexts[$status] ?? 'Desconocido';
}

/**
 * Get payment status emoji for display
 */
function getPaymentStatusEmoji($status) {
    $emojis = [
        'pending' => '⏳',
        'paid' => '✅',
        'failed' => '❌'
    ];
    
    return $emojis[$status] ?? '❓';
}

/**
 * Create SQLite tables - ACTUALIZADO con payment_status
 */
function createSQLiteTables($db) {
    $sql = "
    -- Users table
    CREATE TABLE users (
        id TEXT PRIMARY KEY DEFAULT (hex(randomblob(16))),
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Orders table - ACTUALIZADA con payment_status
    CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_code TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        order_type TEXT NOT NULL CHECK (order_type IN ('physical', 'delivery')),
        queue_type TEXT DEFAULT 'mixtos' CHECK (queue_type IN ('tradicionales', 'especiales', 'mixtos')),
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivered')),
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
        total INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Order items table
    CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        unit_price INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- Deliveries table
    CREATE TABLE deliveries (
        order_id INTEGER PRIMARY KEY,
        phone TEXT NOT NULL,
        receiver_name TEXT,
        receiver_phone TEXT,
        address TEXT NOT NULL,
        neighborhood TEXT NOT NULL,
        delivery_references TEXT,
        payment_method TEXT NOT NULL CHECK (payment_method IN ('transfer', 'cash', 'whatsapp')),
        receipt_path TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    -- Order status history
    CREATE TABLE order_status_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        changed_by TEXT,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (changed_by) REFERENCES users(id)
    );

    -- Insert default admin user (password: admin123)
    INSERT INTO users (id, username, password_hash, role) VALUES 
    (hex(randomblob(16)), 'admin', '\$2y\$10\$Dw0Hlzv6at3.m3gm6HR2H.OXtqm.twWwfceBZ9kKr.QRDY97bR1j6', 'admin');
    ";
    
    $db->exec($sql);
    error_log("SQLite tables created successfully with payment_status");
}

/**
 * Initialize the system
 */
function initializeSystem() {
    ensureDatabaseTables();
}


?>