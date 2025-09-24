<?php
/**
 * Configuration file for Buñuelos Ordering System
 */

// Error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Timezone
date_default_timezone_set('America/Bogota');

// Database Configuration
// For development/demo: SQLite
// For production: MySQL
if (file_exists(__DIR__ . '/../.env.local') || isset($_ENV['REPLIT_DB_URL'])) {
    // Development environment (Replit or local with SQLite)
    define('DB_TYPE', 'sqlite');
    define('DB_FILE', __DIR__ . '/../database/bunuelos.sqlite');
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'bunuelos_app');
    define('DB_USER', 'root');
    define('DB_PASS', '');
} else {
    // Production environment (MySQL)
    define('DB_TYPE', 'mysql');
    define('DB_HOST', $_ENV['DB_HOST'] ?? 'localhost');
    define('DB_NAME', $_ENV['DB_NAME'] ?? 'bunuelos_app');
    define('DB_USER', $_ENV['DB_USER'] ?? 'root');
    define('DB_PASS', $_ENV['DB_PASS'] ?? '');
}

// Application Settings
define('APP_NAME', 'Buñuelos Deliciosos');
define('APP_VERSION', '1.0.0');
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost');

// Security Settings
define('SESSION_LIFETIME', 3600); // 1 hour
define('CSRF_TOKEN_LIFETIME', 3600); // 1 hour

// Upload Settings
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('UPLOAD_ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'pdf']);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

// Business Settings
define('DELIVERY_FEE', 2000); // COP cents
define('MIN_ORDER_DELIVERY', 10000); // COP cents
define('MAX_ITEMS_PER_ORDER', 50);

// WhatsApp Integration (optional)
define('WHATSAPP_NUMBER', '+573123456789'); // Replace with actual number

// Email Settings (if needed)
define('SMTP_HOST', $_ENV['SMTP_HOST'] ?? '');
define('SMTP_USER', $_ENV['SMTP_USER'] ?? '');
define('SMTP_PASS', $_ENV['SMTP_PASS'] ?? '');
define('SMTP_PORT', $_ENV['SMTP_PORT'] ?? 587);

// Initialize session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Initialize system
require_once __DIR__ . '/../includes/helpers.php';
initializeSystem();

// Debug mode
define('DEBUG_MODE', $_ENV['DEBUG'] ?? false);

if (DEBUG_MODE) {
    error_log("=== APP CONFIG LOADED ===");
    error_log("DB Type: " . DB_TYPE);
    error_log("App URL: " . APP_URL);
    error_log("Session ID: " . session_id());
}
?>