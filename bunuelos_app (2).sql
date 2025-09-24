-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 24-09-2025 a las 16:21:47
-- Versión del servidor: 8.0.31
-- Versión de PHP: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bunuelos_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bebidas`
--

DROP TABLE IF EXISTS `bebidas`;
CREATE TABLE IF NOT EXISTS `bebidas` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `categoria` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'bebidas',
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `bebidas`
--

INSERT INTO `bebidas` (`id`, `nombre`, `descripcion`, `precio`, `categoria`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('malta-1500ml', 'Malta Litro y Medio', 'Malta 1.5 litros', '6000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-1000ml', 'Malta Litro', 'Malta 1 litro', '4000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-personal', 'Malta Personal', 'Malta personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-lata', 'Malta Lata', 'Malta en lata', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-mini', 'Malta Mini', 'Malta mini', '1500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('valle-1500ml', 'Valle 1.5 Litros', 'Valle 1.5 litros', '4000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('valle-personal', 'Valle Personal', 'Valle personal', '2000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-1500ml', 'Coca Cola 1.5 Litros', 'Coca Cola 1.5 litros', '6500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-1000ml', 'Coca Cola Litro', 'Coca Cola 1 litro', '4500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-personal', 'Coca Cola Personal', 'Coca Cola personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-mega', 'Coca Cola Mega', 'Coca Cola mega', '11000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('cuatro-4500ml', 'Cuatro 4.5 Litros', 'Cuatro 4.5 litros', '5000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('cuatro-personal', 'Cuatro Personal', 'Cuatro personal', '2500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('kola-roman-1500ml', 'Kola Román 1.5 Litros', 'Kola Román 1.5 litros', '4500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('kola-roman-personal', 'Kola Román Personal', 'Kola Román personal', '2500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-hit-1500ml', 'Jugo Hit 1.5 Litros', 'Jugo Hit 1.5 litros', '5000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-hit-personal', 'Jugo Hit Personal', 'Jugo Hit personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-pul-1500ml', 'Jugo Pul 1.5 Litros', 'Jugo Pul 1.5 litros', '6500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-pul-1000ml', 'Jugo Pul Litro', 'Jugo Pul 1 litro', '5500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-pul-personal', 'Jugo Pul Personal', 'Jugo Pul personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('avenas-bolsa', 'Avenas Bolsa', 'Avenas en bolsa', '2000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
CREATE TABLE IF NOT EXISTS `deliveries` (
  `order_id` int NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receiver_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `neighborhood` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_references` text COLLATE utf8mb4_unicode_ci,
  `payment_method` enum('transfer','cash','whatsapp') COLLATE utf8mb4_unicode_ci NOT NULL,
  `receipt_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `deliveries`
--

INSERT INTO `deliveries` (`order_id`, `phone`, `receiver_name`, `receiver_phone`, `address`, `neighborhood`, `delivery_references`, `payment_method`, `receipt_path`) VALUES
(2, '3052742769', 'fabber', '3052742769', 'cll 14 #43-27', 'san francisco', 'diagonal a respuestos el parce', 'cash', NULL),
(3, '3052742769', 'fabian', '3052742769', 'cll 14 #43-27', 'san francisco', 'diagonal a repuestos el parce', 'cash', NULL),
(5, '3052742769', 'julio', '3052742769', 'cll 14 #43-27', 'san francisco', 'diagonal al parce', 'cash', NULL),
(7, '3005553000', 'valentina', '3005553000', 'cll 25 # 23-56', 'el carmen', 'casa de rejas blancas', 'transfer', NULL),
(8, '3005553000', 'valentina', '3005553000', 'cll 25 # 23-56', 'el carmen', 'casa blanca', 'transfer', NULL),
(9, '3005553000', 'fabber', '3005553000', 'cll 14 #43-27', 'san francisco', '', 'transfer', NULL),
(10, '3002002323', 'fabian berrio', '3002002323', 'cll14 #34-27', 'san francisco', 'diagonal a repuestos el parce', 'transfer', NULL),
(11, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(12, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(13, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(14, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(15, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(16, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(17, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(18, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(19, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(20, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(21, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(22, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(23, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(24, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(25, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(26, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(27, '300 200 2323', 'David', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(28, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(29, '300 200 2323', 'Luis', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(30, '300 200 2323', 'Luis', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(31, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(32, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(33, '300 200 2323', 'Jorge', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(34, '300 200 2323', 'Jorge', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(35, '300 200 2323', 'Ivan', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(36, '300 200 2323', 'David', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(37, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(38, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(39, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(40, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(41, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(42, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(43, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(44, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(45, '300 200 2323', 'Luifer', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(47, '300 200 2323', 'Jorge', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(48, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(49, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(50, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(51, '313 788 2040', 'Faber', '313 788 2040', 'cll 50 # 45-56', 'Carmen', '', 'cash', NULL),
(52, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(53, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(54, '300 200 2323', 'Faber', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(55, '535 525 55533', 'Faber', '535 525 55533', 'cll 24 -45', 'Carmen', '', 'cash', NULL),
(56, '300 256 6363', 'Faber', '300 256 6363', 'cll 14 # 45-56', 'Carmen', 'casa blanca', 'cash', NULL),
(57, '535 525 55533', 'Faber', '535 525 55533', 'cll 24 -45', 'Carmen', '', 'transfer', NULL),
(58, '535 525 55533', 'Faber', '535 525 55533', 'cll 24 -45', 'Carmen', '', 'cash', NULL),
(59, '300 200 2323', 'Luis', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(60, '300 200 2323', 'Jorge', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(61, '300 200 2323', 'Luis', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(62, '300 200 2323', 'Juan', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL),
(63, '300 200 2323', 'David', '300 200 2323', 'cll14 #34-27', 'San Francisco', '', 'cash', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_code` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_type` enum('physical','delivery') COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_type` enum('tradicionales','especiales','mixtos') COLLATE utf8mb4_unicode_ci DEFAULT 'mixtos',
  `status` enum('pending','preparing','ready','delivered') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `total` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_status` enum('pending','paid','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_code` (`order_code`),
  KEY `idx_status` (`status`),
  KEY `idx_order_type` (`order_type`),
  KEY `idx_queue_type` (`queue_type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=MyISAM AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id`, `order_code`, `customer_name`, `order_type`, `queue_type`, `status`, `total`, `created_at`, `updated_at`, `payment_status`) VALUES
(23, 'PED12172066', 'Luifer', 'delivery', 'mixtos', 'pending', 16500, '2025-09-23 12:17:20', '2025-09-23 12:17:20', 'pending'),
(22, 'PED12164623', 'Luifer', 'delivery', 'mixtos', 'pending', 7600, '2025-09-23 12:16:46', '2025-09-23 12:16:46', 'pending'),
(21, 'PED12162416', 'Luifer', 'delivery', 'mixtos', 'pending', 6000, '2025-09-23 12:16:24', '2025-09-23 12:16:24', 'pending'),
(20, 'PED12141110', 'Luifer', 'delivery', 'mixtos', 'pending', 6000, '2025-09-23 12:14:11', '2025-09-23 12:14:11', 'pending'),
(19, 'PED12135176', 'Luifer', 'delivery', 'mixtos', 'preparing', 6000, '2025-09-23 12:13:51', '2025-09-24 09:30:14', 'pending'),
(18, 'PED12073998', 'Faber', 'delivery', 'mixtos', 'pending', 12000, '2025-09-23 12:07:39', '2025-09-23 12:09:57', 'paid'),
(17, 'PED12054443', 'Luifer', 'delivery', 'mixtos', 'pending', 16000, '2025-09-23 12:05:44', '2025-09-23 12:10:07', 'failed'),
(16, 'PED-20250923', 'Luifer', 'delivery', 'mixtos', 'pending', 6000, '2025-09-23 11:52:54', '2025-09-23 11:52:54', 'pending'),
(24, 'PED12180622', 'Luifer', 'delivery', 'mixtos', 'pending', 20100, '2025-09-23 12:18:06', '2025-09-23 12:18:06', 'pending'),
(25, 'PED12185336', 'Luifer', 'delivery', 'mixtos', 'pending', 39500, '2025-09-23 12:18:53', '2025-09-23 12:18:53', 'pending'),
(26, 'PED12193255', 'Luifer', 'delivery', 'mixtos', 'pending', 37000, '2025-09-23 12:19:32', '2025-09-23 12:19:32', 'pending'),
(27, 'PED12234775', 'David', 'delivery', 'mixtos', 'pending', 3500, '2025-09-23 12:23:47', '2025-09-23 12:23:47', 'pending'),
(28, 'PED13124525', 'Faber', 'delivery', 'tradicionales', 'pending', 6000, '2025-09-23 13:12:45', '2025-09-23 13:12:45', 'pending'),
(29, 'PED13201332', 'Luis', 'delivery', 'mixtos', 'pending', 16300, '2025-09-23 13:20:13', '2025-09-23 13:20:13', 'pending'),
(30, 'PED13350083', 'Luis', 'delivery', 'mixtos', 'pending', 13400, '2025-09-23 13:35:00', '2025-09-23 13:35:00', 'pending'),
(31, 'PED13381334', 'Faber', 'delivery', 'mixtos', 'pending', 6300, '2025-09-23 13:38:13', '2025-09-23 13:38:13', 'pending'),
(32, 'PED13441671', 'Faber', 'delivery', 'mixtos', 'pending', 10500, '2025-09-23 13:44:16', '2025-09-23 13:44:16', 'pending'),
(33, 'PED13451829', 'Jorge', 'delivery', 'mixtos', 'pending', 17600, '2025-09-23 13:45:18', '2025-09-23 13:45:18', 'pending'),
(34, 'PED13473564', 'Jorge', 'delivery', 'mixtos', 'pending', 9900, '2025-09-23 13:47:35', '2025-09-23 13:47:35', 'pending'),
(35, 'PED13542746', 'Ivan', 'delivery', 'mixtos', 'pending', 13400, '2025-09-23 13:54:27', '2025-09-23 13:54:27', 'pending'),
(36, 'PED13554754', 'David', 'delivery', 'mixtos', 'pending', 6100, '2025-09-23 13:55:47', '2025-09-23 13:55:47', 'pending'),
(37, 'PED14095987', 'Luifer', 'delivery', 'mixtos', 'pending', 14000, '2025-09-23 14:09:59', '2025-09-23 14:09:59', 'pending'),
(38, 'PED14292097', 'Faber', 'delivery', 'tradicionales', 'pending', 14000, '2025-09-23 14:29:20', '2025-09-23 14:29:20', 'pending'),
(39, 'PED14295554', 'Luifer', 'delivery', 'tradicionales', 'pending', 12500, '2025-09-23 14:29:55', '2025-09-23 14:29:55', 'pending'),
(40, 'PED14301727', 'Faber', 'delivery', 'tradicionales', 'pending', 6000, '2025-09-23 14:30:17', '2025-09-23 14:30:17', 'pending'),
(41, 'PED14313999', 'Faber', 'delivery', 'tradicionales', 'pending', 11600, '2025-09-23 14:31:39', '2025-09-23 14:31:39', 'pending'),
(42, 'PED14322381', 'Faber', 'delivery', 'tradicionales', 'pending', 14000, '2025-09-23 14:32:23', '2025-09-23 14:32:23', 'pending'),
(43, 'PED14364070', 'Faber', 'delivery', 'especiales', 'pending', 8000, '2025-09-23 14:36:40', '2025-09-23 14:36:40', 'pending'),
(44, 'PED14370671', 'Luifer', 'delivery', 'tradicionales', 'pending', 2500, '2025-09-23 14:37:06', '2025-09-23 14:37:06', 'pending'),
(45, 'PED14373751', 'Luifer', 'delivery', 'mixtos', 'pending', 14000, '2025-09-23 14:37:37', '2025-09-23 14:37:37', 'pending'),
(46, 'PED14383079', 'Faber', 'physical', 'mixtos', 'pending', 6700, '2025-09-23 14:38:30', '2025-09-23 14:38:30', 'pending'),
(47, 'PED14553157', 'Jorge', 'delivery', 'mixtos', 'pending', 15600, '2025-09-23 14:55:31', '2025-09-23 14:55:31', 'pending'),
(48, 'PED14570295', 'Faber', 'delivery', 'mixtos', 'pending', 18000, '2025-09-23 14:57:02', '2025-09-23 15:45:47', 'failed'),
(49, 'PED15024285', 'Faber', 'delivery', 'mixtos', 'pending', 19900, '2025-09-23 15:02:42', '2025-09-23 15:45:45', 'failed'),
(50, 'PED15343513', 'Faber', 'delivery', 'mixtos', 'preparing', 18200, '2025-09-23 15:34:35', '2025-09-23 15:45:43', 'failed'),
(51, 'PED17454189', 'Faber', 'delivery', 'tradicionales', 'pending', 6000, '2025-09-23 17:45:41', '2025-09-23 17:45:41', 'pending'),
(52, 'PED18502796', 'Faber', 'delivery', 'tradicionales', 'pending', 5000, '2025-09-23 18:50:27', '2025-09-23 18:50:27', 'pending'),
(53, 'PED20035662', 'Faber', 'delivery', 'tradicionales', 'pending', 5000, '2025-09-23 20:03:56', '2025-09-23 20:03:56', 'pending'),
(54, 'PED20045183', 'Faber', 'delivery', 'tradicionales', 'pending', 6000, '2025-09-23 20:04:51', '2025-09-23 20:04:51', 'pending'),
(55, 'PED20254880', 'Faber', 'delivery', 'mixtos', 'delivered', 14000, '2025-09-23 20:25:48', '2025-09-24 10:07:46', 'paid'),
(56, 'PED20391025', 'Faber', 'delivery', 'tradicionales', 'pending', 8500, '2025-09-23 20:39:10', '2025-09-24 10:12:07', 'paid'),
(57, 'PED20412626', 'Faber', 'delivery', 'tradicionales', 'pending', 34000, '2025-09-23 20:41:26', '2025-09-23 20:41:26', 'pending'),
(58, 'PED21344458', 'Faber', 'delivery', 'tradicionales', 'pending', 6000, '2025-09-23 21:34:44', '2025-09-23 21:34:44', 'pending'),
(59, 'PED09103521', 'Luis', 'delivery', 'tradicionales', 'preparing', 6000, '2025-09-24 09:10:35', '2025-09-24 09:15:34', 'paid'),
(60, 'PED09160652', 'Jorge', 'delivery', 'tradicionales', 'preparing', 3500, '2025-09-24 09:16:06', '2025-09-24 09:31:21', 'pending'),
(61, 'PED09352039', 'Luis', 'delivery', 'tradicionales', 'pending', 6000, '2025-09-24 09:35:20', '2025-09-24 09:35:40', 'failed'),
(62, 'PED10094894', 'Juan', 'delivery', 'mixtos', 'pending', 10500, '2025-09-24 10:09:48', '2025-09-24 10:12:11', 'paid'),
(63, 'PED10112137', 'David', 'delivery', 'tradicionales', 'delivered', 6000, '2025-09-24 10:11:21', '2025-09-24 10:12:33', 'paid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit_price` int NOT NULL,
  `quantity` int NOT NULL,
  `subtotal` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=MyISAM AUTO_INCREMENT=207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `name`, `unit_price`, `quantity`, `subtotal`) VALUES
(1, 1, 'Buñuelo Clásico', 1500, 1, 1500),
(2, 1, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(3, 2, 'Buñuelo Clásico', 1500, 1, 1500),
(4, 2, 'Buñuelo con Azúcar', 2000, 1, 2000),
(5, 2, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(6, 2, 'Buñuelo Hawaiano', 3000, 1, 3000),
(7, 2, 'Buñuelo Ranchero', 3000, 1, 3000),
(8, 2, 'Buñuelo de Mermelada', 2000, 1, 2000),
(9, 2, 'Buñuelo de Bocadillo', 2000, 1, 2000),
(10, 2, 'Buñuelo de Arequipe', 2000, 1, 2000),
(11, 3, 'Buñuelo Clásico', 1500, 1, 1500),
(12, 3, 'Buñuelo con Azúcar', 2000, 1, 2000),
(13, 3, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(14, 3, 'Buñuelo Hawaiano', 3000, 1, 3000),
(15, 3, 'Buñuelo Ranchero', 3000, 1, 3000),
(16, 3, 'Buñuelo de Mermelada', 2000, 1, 2000),
(17, 3, 'Buñuelo de Bocadillo', 2000, 1, 2000),
(18, 3, 'Buñuelo de Arequipe', 2000, 1, 2000),
(19, 4, 'Buñuelo con Azúcar', 2000, 1, 2000),
(20, 4, 'Buñuelo de Mermelada', 2000, 1, 2000),
(21, 4, 'Buñuelo de Arequipe', 2000, 1, 2000),
(22, 5, 'Buñuelo Clásico', 1500, 1, 1500),
(23, 5, 'Buñuelo con Azúcar', 2000, 1, 2000),
(24, 5, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(25, 5, 'Buñuelo de Mermelada', 2000, 1, 2000),
(26, 6, 'Buñuelo con Azúcar', 2000, 1, 2000),
(27, 6, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(28, 6, 'Buñuelo Hawaiano', 3000, 1, 3000),
(29, 6, 'Buñuelo de Arequipe', 2000, 1, 2000),
(30, 7, 'Buñuelo con Azúcar', 2000, 1, 2000),
(31, 7, 'Buñuelo de Mermelada', 2000, 1, 2000),
(32, 7, 'Buñuelo de Arequipe', 2000, 1, 2000),
(33, 8, 'Buñuelo Clásico', 1500, 1, 1500),
(34, 8, 'Buñuelo de Queso Mozarella', 2500, 4, 10000),
(35, 8, 'Buñuelo Hawaiano', 3000, 1, 3000),
(36, 8, 'Buñuelo Ranchero', 3000, 1, 3000),
(37, 8, 'Buñuelo de Mermelada', 2000, 1, 2000),
(38, 8, 'Buñuelo de Arequipe', 2000, 2, 4000),
(39, 9, 'Buñuelo Clásico', 1500, 1, 1500),
(40, 9, 'Buñuelo con Azúcar', 2000, 1, 2000),
(41, 10, 'Buñuelo con Azúcar', 2000, 1, 2000),
(42, 10, 'Buñuelo de Mermelada', 2000, 1, 2000),
(43, 11, 'Buñuelo Clásico', 1500, 1, 1500),
(44, 11, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(45, 12, 'Buñuelo Clásico', 1500, 1, 1500),
(46, 12, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(47, 13, 'Buñuelo Clásico', 1500, 1, 1500),
(48, 13, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(49, 14, 'Buñuelo Clásico', 1500, 1, 1500),
(50, 14, 'Buñuelo de Queso Mozarella', 2500, 1, 2500),
(51, 14, 'Buñuelo Hawaiano', 3000, 1, 3000),
(52, 14, 'Buñuelo Ranchero', 3000, 1, 3000),
(53, 14, 'Buñuelo de Mermelada', 2000, 1, 2000),
(54, 14, 'Buñuelo de Bocadillo', 2000, 1, 2000),
(55, 14, 'Buñuelo de Arequipe', 2000, 1, 2000),
(56, 15, 'Malta Litro y Medio', 6000, 1, 6000),
(57, 15, 'Malta Litro', 4000, 1, 4000),
(58, 16, 'Buñuelo Clásico', 2500, 1, 2500),
(59, 16, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(60, 17, 'Buñuelo Clásico', 2500, 1, 2500),
(61, 17, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(62, 17, 'Malta Litro y Medio', 6000, 1, 6000),
(63, 17, 'Malta Litro', 4000, 1, 4000),
(64, 18, 'Buñuelo Clásico', 2500, 1, 2500),
(65, 18, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(66, 18, 'Malta Personal', 3000, 1, 3000),
(67, 18, 'Malta Lata', 3000, 1, 3000),
(68, 19, 'Buñuelo Clásico', 2500, 1, 2500),
(69, 19, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(70, 20, 'Buñuelo Clásico', 2500, 1, 2500),
(71, 20, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(72, 21, 'Buñuelo Clásico', 2500, 1, 2500),
(73, 21, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(74, 22, 'Buñuelo de Mermelada', 3600, 1, 3600),
(75, 22, 'Buñuelo de Bocadillo', 4000, 1, 4000),
(76, 23, 'Buñuelo Hawaiano', 4200, 1, 4200),
(77, 23, 'Buñuelo Ranchero', 3800, 1, 3800),
(78, 23, 'Buñuelo de Bocadillo', 4000, 1, 4000),
(79, 23, 'Buñuelo de Arequipe', 4500, 1, 4500),
(80, 24, 'Buñuelo Hawaiano', 4200, 1, 4200),
(81, 24, 'Buñuelo Ranchero', 3800, 1, 3800),
(82, 24, 'Buñuelo de Mermelada', 3600, 1, 3600),
(83, 24, 'Buñuelo de Bocadillo', 4000, 1, 4000),
(84, 24, 'Buñuelo de Arequipe', 4500, 1, 4500),
(85, 25, 'Malta Litro y Medio', 6000, 1, 6000),
(86, 25, 'Malta Litro', 4000, 1, 4000),
(87, 25, 'Malta Personal', 3000, 1, 3000),
(88, 25, 'Malta Lata', 3000, 1, 3000),
(89, 25, 'Coca Cola Mega', 11000, 1, 11000),
(90, 25, 'Cuatro 4.5 Litros', 5000, 1, 5000),
(91, 25, 'Jugo Pul Litro', 5500, 1, 5500),
(92, 25, 'Avenas Bolsa', 2000, 1, 2000),
(93, 26, 'Buñuelo Clásico', 2500, 1, 2500),
(94, 26, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(95, 26, 'Buñuelo Hawaiano', 4200, 1, 4200),
(96, 26, 'Buñuelo Ranchero', 3800, 1, 3800),
(97, 26, 'Malta Litro y Medio', 6000, 1, 6000),
(98, 26, 'Valle 1.5 Litros', 4000, 1, 4000),
(99, 26, 'Kola Román 1.5 Litros', 4500, 1, 4500),
(100, 26, 'Jugo Pul 1.5 Litros', 6500, 1, 6500),
(101, 26, 'Avenas Bolsa', 2000, 1, 2000),
(102, 27, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(103, 28, 'Buñuelo Clásico', 2500, 1, 2500),
(104, 28, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(105, 29, 'Buñuelo Clásico', 2500, 1, 2500),
(106, 29, 'Buñuelo Hawaiano', 4200, 1, 4200),
(107, 29, 'Buñuelo de Mermelada', 3600, 1, 3600),
(108, 29, 'Malta Personal', 3000, 1, 3000),
(109, 29, 'Malta Lata', 3000, 1, 3000),
(110, 30, 'Buñuelo Clásico', 2500, 1, 2500),
(111, 30, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(112, 30, 'Buñuelo Ranchero', 3800, 1, 3800),
(113, 30, 'Buñuelo de Mermelada', 3600, 1, 3600),
(114, 31, 'Buñuelo Clásico', 2500, 1, 2500),
(115, 31, 'Buñuelo Ranchero', 3800, 1, 3800),
(116, 32, 'Buñuelo Clásico', 2500, 1, 2500),
(117, 32, 'Buñuelo Hawaiano', 4200, 1, 4200),
(118, 32, 'Buñuelo Ranchero', 3800, 1, 3800),
(119, 33, 'Buñuelo Clásico', 2500, 1, 2500),
(120, 33, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(121, 33, 'Buñuelo Hawaiano', 4200, 1, 4200),
(122, 33, 'Buñuelo Ranchero', 3800, 1, 3800),
(123, 33, 'Buñuelo de Mermelada', 3600, 1, 3600),
(124, 34, 'Buñuelo Clásico', 2500, 1, 2500),
(125, 34, 'Buñuelo Ranchero', 3800, 1, 3800),
(126, 34, 'Buñuelo de Mermelada', 3600, 1, 3600),
(127, 35, 'Buñuelo Clásico', 2500, 1, 2500),
(128, 35, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(129, 35, 'Buñuelo Ranchero', 3800, 1, 3800),
(130, 35, 'Buñuelo de Mermelada', 3600, 1, 3600),
(131, 36, 'Buñuelo Clásico', 2500, 1, 2500),
(132, 36, 'Buñuelo de Mermelada', 3600, 1, 3600),
(133, 37, 'Buñuelo Clásico', 2500, 1, 2500),
(134, 37, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(135, 37, 'Buñuelo Hawaiano', 4200, 1, 4200),
(136, 37, 'Buñuelo Ranchero', 3800, 1, 3800),
(137, 38, 'Buñuelo Clásico', 2500, 1, 2500),
(138, 38, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(139, 38, 'Buñuelo Hawaiano', 4200, 1, 4200),
(140, 38, 'Buñuelo Ranchero', 3800, 1, 3800),
(141, 39, 'Buñuelo Hawaiano', 4200, 1, 4200),
(142, 39, 'Buñuelo Ranchero', 3800, 1, 3800),
(143, 39, 'Buñuelo de Arequipe', 4500, 1, 4500),
(144, 40, 'Buñuelo Clásico', 2500, 1, 2500),
(145, 40, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(146, 41, 'Buñuelo Hawaiano', 4200, 1, 4200),
(147, 41, 'Buñuelo Ranchero', 3800, 1, 3800),
(148, 41, 'Buñuelo de Mermelada', 3600, 1, 3600),
(149, 42, 'Buñuelo Clásico', 2500, 1, 2500),
(150, 42, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(151, 42, 'Buñuelo Hawaiano', 4200, 1, 4200),
(152, 42, 'Buñuelo Ranchero', 3800, 1, 3800),
(153, 43, 'Buñuelo Hawaiano', 4200, 1, 4200),
(154, 43, 'Buñuelo Ranchero', 3800, 1, 3800),
(155, 44, 'Buñuelo Clásico', 2500, 1, 2500),
(156, 45, 'Buñuelo Clásico', 2500, 1, 2500),
(157, 45, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(158, 45, 'Buñuelo Hawaiano', 4200, 1, 4200),
(159, 45, 'Buñuelo Ranchero', 3800, 1, 3800),
(160, 46, 'Buñuelo Clásico', 2500, 1, 2500),
(161, 46, 'Buñuelo Hawaiano', 4200, 1, 4200),
(162, 47, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(163, 47, 'Buñuelo de Mermelada', 3600, 1, 3600),
(164, 47, 'Buñuelo de Bocadillo', 4000, 1, 4000),
(165, 47, 'Buñuelo de Arequipe', 4500, 1, 4500),
(166, 48, 'Buñuelo Clásico', 2500, 1, 2500),
(167, 48, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(168, 48, 'Buñuelo Hawaiano', 4200, 1, 4200),
(169, 48, 'Buñuelo Ranchero', 3800, 1, 3800),
(170, 48, 'Malta Litro', 4000, 1, 4000),
(171, 49, 'Buñuelo Clásico', 2500, 1, 2500),
(172, 49, 'Buñuelo Ranchero', 3800, 1, 3800),
(173, 49, 'Buñuelo de Mermelada', 3600, 1, 3600),
(174, 49, 'Malta Litro', 4000, 1, 4000),
(175, 49, 'Malta Personal', 3000, 1, 3000),
(176, 49, 'Malta Lata', 3000, 1, 3000),
(177, 50, 'Buñuelo Clásico', 2500, 1, 2500),
(178, 50, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(179, 50, 'Buñuelo Hawaiano', 4200, 2, 8400),
(180, 50, 'Buñuelo Ranchero', 3800, 1, 3800),
(181, 51, 'Buñuelo Clásico', 2500, 1, 2500),
(182, 51, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(183, 52, 'Buñuelo Clásico', 2500, 2, 5000),
(184, 53, 'Buñuelo Clásico', 2500, 2, 5000),
(185, 54, 'Buñuelo Clásico', 2500, 1, 2500),
(186, 54, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(187, 55, 'Buñuelo Clásico', 2500, 1, 2500),
(188, 55, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(189, 55, 'Buñuelo Hawaiano', 4200, 1, 4200),
(190, 55, 'Buñuelo Ranchero', 3800, 1, 3800),
(191, 56, 'Buñuelo Clásico', 2500, 2, 5000),
(192, 56, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(193, 57, 'Buñuelo Clásico', 2500, 1, 2500),
(194, 57, 'Buñuelo de Queso Mozzarella', 3500, 9, 31500),
(195, 58, 'Buñuelo Clásico', 2500, 1, 2500),
(196, 58, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(197, 59, 'Buñuelo Clásico', 2500, 1, 2500),
(198, 59, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(199, 60, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(200, 61, 'Buñuelo Clásico', 2500, 1, 2500),
(201, 61, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500),
(202, 62, 'Buñuelo Clásico', 2500, 1, 2500),
(203, 62, 'Buñuelo Hawaiano', 4200, 1, 4200),
(204, 62, 'Buñuelo Ranchero', 3800, 1, 3800),
(205, 63, 'Buñuelo Clásico', 2500, 1, 2500),
(206, 63, 'Buñuelo de Queso Mozzarella', 3500, 1, 3500);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
CREATE TABLE IF NOT EXISTS `order_status_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `status` enum('pending','preparing','ready','delivered') COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `changed_by` char(36) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `changed_by` (`changed_by`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_changed_at` (`changed_at`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `order_status_history`
--

INSERT INTO `order_status_history` (`id`, `order_id`, `status`, `changed_at`, `changed_by`) VALUES
(1, 3, 'preparing', '2025-09-18 13:25:37', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(2, 3, 'ready', '2025-09-18 13:46:53', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(3, 3, 'delivered', '2025-09-18 13:46:56', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(4, 7, 'preparing', '2025-09-18 17:08:48', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(5, 7, 'ready', '2025-09-18 17:08:52', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(6, 7, 'delivered', '2025-09-18 17:08:53', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(7, 6, 'preparing', '2025-09-18 17:15:15', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(8, 6, 'ready', '2025-09-18 17:15:16', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(9, 6, 'delivered', '2025-09-18 17:15:17', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(10, 5, 'preparing', '2025-09-18 17:15:23', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(11, 5, 'ready', '2025-09-18 17:15:23', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(12, 5, 'delivered', '2025-09-18 17:15:24', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(13, 4, 'preparing', '2025-09-18 17:15:27', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(14, 4, 'ready', '2025-09-18 17:15:28', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(15, 4, 'delivered', '2025-09-18 17:15:28', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(16, 7, '', '2025-09-18 18:59:15', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(17, 3, '', '2025-09-18 19:06:12', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(18, 5, '', '2025-09-18 19:07:26', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(19, 8, '', '2025-09-18 19:15:00', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(20, 9, 'preparing', '2025-09-21 08:37:31', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(21, 10, '', '2025-09-21 08:44:35', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(22, 10, '', '2025-09-21 17:12:25', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(23, 10, 'preparing', '2025-09-21 17:12:27', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(24, 10, 'ready', '2025-09-21 17:12:31', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(25, 10, 'delivered', '2025-09-21 17:12:33', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(26, 9, 'ready', '2025-09-21 17:12:48', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(27, 9, 'delivered', '2025-09-21 17:12:49', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(28, 8, 'preparing', '2025-09-21 17:28:56', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(29, 8, 'ready', '2025-09-21 17:29:00', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(30, 8, 'delivered', '2025-09-21 17:29:02', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(31, 18, '', '2025-09-23 12:09:57', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(32, 17, '', '2025-09-23 12:10:07', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(33, 50, 'preparing', '2025-09-23 15:45:28', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(34, 50, '', '2025-09-23 15:45:43', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(35, 49, '', '2025-09-23 15:45:45', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(36, 48, '', '2025-09-23 15:45:47', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(37, 59, 'preparing', '2025-09-24 09:15:27', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(38, 59, '', '2025-09-24 09:15:34', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(39, 19, 'preparing', '2025-09-24 09:30:14', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(40, 60, 'preparing', '2025-09-24 09:31:21', 'ac9144ff-93fd-11f0-942a-c85acfa6f668'),
(41, 61, '', '2025-09-24 09:35:40', 'ac9144ff-93fd-11f0-942a-c85acfa6f668');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `precio` decimal(10,2) NOT NULL,
  `categoria` enum('tradicional','especial','bebidas') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `nombre`, `descripcion`, `precio`, `categoria`, `activo`, `fecha_creacion`, `fecha_actualizacion`) VALUES
('bunuelo-clasico', 'Buñuelo Clásico', 'El tradicional buñuelo de toda la vida, crujiente por fuera y suave por dentro', '2500.00', 'tradicional', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:05'),
('bunuelo-queso', 'Buñuelo de Queso Mozzarella', 'Buñuelo relleno de queso mozzarella derretido', '3500.00', 'tradicional', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:05'),
('bunuelo-hawaiano', 'Buñuelo Hawaiano', 'Buñuelo tropical con piña y coco, sabor exótico único', '4200.00', 'especial', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:06'),
('bunuelo-ranchero', 'Buñuelo Ranchero', 'Buñuelo campesino con queso y hierbas finas, estilo tradicional', '3800.00', 'especial', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:06'),
('bunuelo-mermelada', 'Buñuelo de Mermelada', 'Buñuelo dulce relleno de mermelada de mora o fresa', '3600.00', 'especial', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:06'),
('bunuelo-bocadillo', 'Buñuelo de Bocadillo', 'Buñuelo tradicional colombiano relleno de bocadillo de guayaba', '4000.00', 'especial', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:06'),
('bunuelo-arequipe', 'Buñuelo de Arequipe', 'Buñuelo relleno de cremoso arequipe casero', '4500.00', 'especial', 1, '2025-09-21 21:29:45', '2025-09-23 19:26:06'),
('malta-1500ml', 'Malta Litro y Medio', 'Malta 1.5 litros', '6000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-1000ml', 'Malta Litro', 'Malta 1 litro', '4000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-personal', 'Malta Personal', 'Malta personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-lata', 'Malta Lata', 'Malta en lata', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('malta-mini', 'Malta Mini', 'Malta mini', '1500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('valle-1500ml', 'Valle 1.5 Litros', 'Valle 1.5 litros', '4000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('valle-personal', 'Valle Personal', 'Valle personal', '2000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-1500ml', 'Coca Cola 1.5 Litros', 'Coca Cola 1.5 litros', '6500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-1000ml', 'Coca Cola Litro', 'Coca Cola 1 litro', '4500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-personal', 'Coca Cola Personal', 'Coca Cola personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('coca-cola-mega', 'Coca Cola Mega', 'Coca Cola mega', '11000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('cuatro-4500ml', 'Cuatro 4.5 Litros', 'Cuatro 4.5 litros', '5000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('cuatro-personal', 'Cuatro Personal', 'Cuatro personal', '2500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('kola-roman-1500ml', 'Kola Román 1.5 Litros', 'Kola Román 1.5 litros', '4500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('kola-roman-personal', 'Kola Román Personal', 'Kola Román personal', '2500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-hit-1500ml', 'Jugo Hit 1.5 Litros', 'Jugo Hit 1.5 litros', '5000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-hit-personal', 'Jugo Hit Personal', 'Jugo Hit personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-pul-1500ml', 'Jugo Pul 1.5 Litros', 'Jugo Pul 1.5 litros', '6500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-pul-1000ml', 'Jugo Pul Litro', 'Jugo Pul 1 litro', '5500.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('jugo-pul-personal', 'Jugo Pul Personal', 'Jugo Pul personal', '3000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('avenas-bolsa', 'Avenas Bolsa', 'Avenas en bolsa', '2000.00', 'bebidas', 1, '2025-09-21 21:29:45', '2025-09-21 21:29:45'),
('', 'Combo Mixto', NULL, '5000.00', '', 1, '2025-09-23 19:03:31', '2025-09-23 19:03:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT (uuid()),
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','staff','customer') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_username` (`username`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`) VALUES
('ac9144ff-93fd-11f0-942a-c85acfa6f668', 'admin', '$2y$10$Dw0Hlzv6at3.m3gm6HR2H.OXtqm.twWwfceBZ9kKr.QRDY97bR1j6', 'admin', '2025-09-17 14:36:57');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
