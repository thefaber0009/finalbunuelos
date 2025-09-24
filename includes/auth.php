<?php

class Auth {
    
    /**
     * Generate CSRF token
     */
    public static function getCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            $_SESSION['csrf_token_time'] = time();
        }
        
        // Regenerate token if expired
        if (time() - $_SESSION['csrf_token_time'] > CSRF_TOKEN_LIFETIME) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
            $_SESSION['csrf_token_time'] = time();
        }
        
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Validate CSRF token
     */
    public static function validateCSRF($token) {
        if (empty($token) || empty($_SESSION['csrf_token'])) {
            error_log("CSRF validation failed: empty token");
            return false;
        }
        
        // Check token expiration
        if (time() - ($_SESSION['csrf_token_time'] ?? 0) > CSRF_TOKEN_LIFETIME) {
            error_log("CSRF validation failed: token expired");
            return false;
        }
        
        $isValid = hash_equals($_SESSION['csrf_token'], $token);
        if (!$isValid) {
            error_log("CSRF validation failed: token mismatch");
        }
        
        return $isValid;
    }

 
    public static function generateCSRFToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }
    
    /**
     * Obtener token CSRF actual
     */

    
    /**
     * Validar token CSRF
     */
    public static function validateCSRFToken($token) {
        if (!isset($_SESSION['csrf_token'])) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    
    /**
     * Login user
     */
    public static function login($username, $password) {
        try {
            $db = getDB();
            
            $stmt = $db->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['login_time'] = time();
                
                error_log("User logged in: " . $username);
                return true;
            }
            
            error_log("Login failed for user: " . $username);
            return false;
            
        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Logout user
     */
    public static function logout() {
        $username = $_SESSION['username'] ?? 'unknown';
        session_destroy();
        error_log("User logged out: " . $username);
    }
    
    /**
     * Check if user is logged in
     */
    public static function isLoggedIn() {
        if (empty($_SESSION['user_id']) || empty($_SESSION['login_time'])) {
            return false;
        }
        
        // Check session expiration
        if (time() - $_SESSION['login_time'] > SESSION_LIFETIME) {
            self::logout();
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if user is admin
     */
    public static function isAdmin() {
        return self::isLoggedIn() && ($_SESSION['role'] ?? '') === 'admin';
    }
    
    /**
     * Require admin access
     */
    public static function requireAdmin() {
        if (!self::isAdmin()) {
            error_log("Unauthorized admin access attempt");
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Access denied']);
            exit;
        }
    }
    
    /**
     * Require login
     */
    public static function requireLogin() {
        if (!self::isLoggedIn()) {
            error_log("Unauthorized access attempt");
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Login required']);
            exit;
        }
    }
    
    /**
     * Get current user data
     */
    public static function getCurrentUser() {
        if (!self::isLoggedIn()) {
            return null;
        }
        
        return [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'role' => $_SESSION['role']
        ];
    }
    
    /**
     * Hash password
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_DEFAULT);
    }
    
    /**
     * Create user (for setup/admin purposes)
     */
    public static function createUser($username, $password, $role = 'customer') {
        try {
            $db = getDB();
            
            // Check if user exists
            $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->execute([$username]);
            if ($stmt->fetch()) {
                return false; // User already exists
            }
            
            // Create user
            $stmt = $db->prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)");
            $result = $stmt->execute([$username, self::hashPassword($password), $role]);
            
            if ($result) {
                error_log("User created: " . $username . " (role: " . $role . ")");
                return true;
            }
            
            return false;
            
        } catch (Exception $e) {
            error_log("User creation error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Generate secure session ID
     */
    public static function regenerateSession() {
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }
    }
}

// Auto-regenerate CSRF token for each page load (for frontend)
if (!defined('API_ENDPOINT')) {
    Auth::getCSRFToken();
}


?>