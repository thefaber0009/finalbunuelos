<?php
require_once __DIR__ . '/../config/config.php';

class Database {
    private static $instance = null;
    private $connection;

    private function __construct() {
        try {
            // Support both SQLite (for Replit demo) and MySQL (for production)
            if (DB_TYPE === 'sqlite') {
                $dsn = "sqlite:" . DB_FILE;
                $this->connection = new PDO($dsn, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
                // Enable foreign keys for SQLite
                $this->connection->exec('PRAGMA foreign_keys = ON');
            } else {
                $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                $this->connection = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            }
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            die("Database connection failed");
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    public function prepare($sql) {
        return $this->connection->prepare($sql);
    }

    public function lastInsertId() {
        return $this->connection->lastInsertId();
    }

    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }

    public function commit() {
        return $this->connection->commit();
    }

    public function rollback() {
        return $this->connection->rollback();
    }
}

// Helper function to get database instance
function getDB() {
    return Database::getInstance();
}
?>