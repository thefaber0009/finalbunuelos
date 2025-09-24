-- MySQL Schema for Buñuelos Ordering System
-- Character Set: utf8mb4 for proper Unicode support

CREATE DATABASE IF NOT EXISTS bunuelos_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bunuelos_app;

-- Users table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'customer') DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(12) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    order_type ENUM('physical', 'delivery') NOT NULL,
    queue_type ENUM('tradicionales', 'especiales', 'mixtos') DEFAULT 'mixtos',
    status ENUM('pending', 'preparing', 'ready', 'delivered') DEFAULT 'pending',
    total INT NOT NULL, -- Price in COP cents
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_order_type (order_type),
    INDEX idx_queue_type (queue_type),
    INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    unit_price INT NOT NULL, -- Price in COP cents
    quantity INT NOT NULL,
    subtotal INT NOT NULL, -- Price in COP cents
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id)
);

-- Deliveries table
CREATE TABLE deliveries (
    order_id INT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    receiver_name VARCHAR(150),
    receiver_phone VARCHAR(20),
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    delivery_references TEXT,
    payment_method ENUM('transfer', 'cash', 'whatsapp') NOT NULL,
    receipt_path VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Order status history (optional for tracking)
CREATE TABLE order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status ENUM('pending', 'preparing', 'ready', 'delivered') NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_by CHAR(36),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id),
    INDEX idx_order_id (order_id),
    INDEX idx_changed_at (changed_at)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (id, username, password_hash, role) VALUES 
(UUID(), 'admin', '$2y$10$Dw0Hlzv6at3.m3gm6HR2H.OXtqm.twWwfceBZ9kKr.QRDY97bR1j6', 'admin');

-- Sample menu items can be hardcoded in PHP, but here's a reference
/*
Buñuelo Clásico - $1500
Buñuelo con Azúcar - $2000  
Buñuelo de Queso Mozarella - $2500
Buñuelo Hawaiano - $3000
Buñuelo Ranchero - $3000
Buñuelo de Mermelada - $2000
Buñuelo de Bocadillo - $2000
Buñuelo de Arequipe - $2000
*/