<?php
require_once '../config/config.php';
require_once '../includes/auth.php';
require_once '../includes/db.php';
require_once '../includes/helpers.php';

Auth::requireAdmin();

// Get orders with filters
$statusFilter = $_GET['status'] ?? '';
$typeFilter = $_GET['type'] ?? '';
$queueFilter = $_GET['queue'] ?? '';

$db = getDB();

// Build query with filters
$whereConditions = [];
$params = [];

if ($statusFilter) {
    $whereConditions[] = "o.status = ?";
    $params[] = $statusFilter;
}

if ($typeFilter) {
    $whereConditions[] = "o.order_type = ?";
    $params[] = $typeFilter;
}

if ($queueFilter) {
    $whereConditions[] = "o.queue_type = ?";
    $params[] = $queueFilter;
}

$whereClause = '';
if ($whereConditions) {
    $whereClause = 'WHERE ' . implode(' AND ', $whereConditions);
}

// Get orders with items - ACTUALIZADA para incluir payment_status
$stmt = $db->prepare("
    SELECT o.*, d.address, d.phone as delivery_phone, o.payment_status
    FROM orders o 
    LEFT JOIN deliveries d ON o.id = d.order_id 
    $whereClause 
    ORDER BY o.created_at DESC 
    LIMIT 50
");
$stmt->execute($params);
$orders = $stmt->fetchAll();

// Get order items for each order
foreach ($orders as &$order) {
    $itemsStmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $itemsStmt->execute([$order['id']]);
    $order['items'] = $itemsStmt->fetchAll();
}

// Get statistics - portable SQL for both MySQL and SQLite
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
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - El Rey de los Buñuelos</title>
    <link rel="stylesheet" href="styles.css">      
    <meta name="csrf-token" content="<?= Auth::getCSRFToken() ?>">
</head>
<body>
    <!-- Loading Overlay -->
    <div class="loading-overlay" id="loadingOverlay">
        <div class="loading-spinner"></div>
    </div>

    <div class="header">
        <h1>🧄 Dashboard Admin - El Rey de los Buñuelos</h1>
        <div class="user-info">
            <span>Bienvenido, <?= e(Auth::getCurrentUser()['username']) ?></span>
            <button class="notification-toggle" id="notificationToggle">
                🔔 Notificaciones: ON
            </button>
            <a href="../api/logout.php" class="logout-btn">Cerrar Sesión</a>
        </div>
    </div>

    <div class="dashboard">
        <!-- Estadísticas -->
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Pedidos Hoy</h3>
                <div class="stat-number"><?= $stats['total_orders'] ?></div>
            </div>
            <div class="stat-card">
                <h3>Listos</h3>
                <div class="stat-number"><?= $stats['ready_orders'] ?></div>
            </div>
            <div class="stat-card">
                <h3>En Preparación</h3>
                <div class="stat-number"><?= $stats['preparing_orders'] ?></div>
            </div>
            <div class="stat-card">
                <h3>Ingresos Hoy</h3>
                <div class="stat-number"><?= formatCurrency($stats['today_revenue']) ?></div>
            </div>
        </div>

        <!-- Navegación -->
        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showSection('orders')">📋 Pedidos</button>
            <button class="nav-tab" onclick="showSection('queues')">🎫 Gestión de Turnos</button>
            <button class="nav-tab" onclick="showSection('printer')">🖨️ Impresora</button>
        </div>

        <!-- Sección Pedidos -->
        <div id="orders-section" class="content-section active">
            <!-- Filtros CORREGIDOS con formulario -->
            <form method="GET" class="filters" id="filtersForm">
                <div class="filter-group">
                    <label class="filter-label">Estado:</label>
                    <select name="status" class="filter-select">
                        <option value="">Todos los Estados</option>
                        <option value="pending" <?= $statusFilter === 'pending' ? 'selected' : '' ?>>Pendiente</option>
                        <option value="preparing" <?= $statusFilter === 'preparing' ? 'selected' : '' ?>>Preparando</option>
                        <option value="ready" <?= $statusFilter === 'ready' ? 'selected' : '' ?>>Listo</option>
                        <option value="delivered" <?= $statusFilter === 'delivered' ? 'selected' : '' ?>>Entregado</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Tipo:</label>
                    <select name="type" class="filter-select">
                        <option value="">Todos los Tipos</option>
                        <option value="physical" <?= $typeFilter === 'physical' ? 'selected' : '' ?>>En Local</option>
                        <option value="delivery" <?= $typeFilter === 'delivery' ? 'selected' : '' ?>>Domicilio</option>
                    </select>
                </div>
                
                <div class="filter-group">
                    <label class="filter-label">Cola:</label>
                    <select name="queue" class="filter-select">
                        <option value="">Todas las Filas</option>
                        <option value="tradicionales" <?= $queueFilter === 'tradicionales' ? 'selected' : '' ?>>Tradicionales</option>
                        <option value="especiales" <?= $queueFilter === 'especiales' ? 'selected' : '' ?>>Especiales</option>
                        <option value="mixtos" <?= $queueFilter === 'mixtos' ? 'selected' : '' ?>>Mixtos</option>
                    </select>
                </div>
                
                <div class="filter-actions">
                    <button type="submit" class="btn btn-primary">🔍 Filtrar</button>
                    <button type="button" class="btn btn-warning" onclick="clearFilters()">🗑️ Limpiar</button>
                    <button type="button" class="btn btn-success" onclick="refreshData()">🔄 Actualizar</button>
                    <button type="button" class="btn btn-success" onclick="playTestSound()">🔊 Probar Sonido</button>
                </div>
            </form>

            <div class="orders-grid" id="ordersGrid">
                <?php if (empty($orders)): ?>
                    <div class="empty-state">
                        <div class="icon">📋</div>
                        <h3>No hay pedidos</h3>
                        <p>Los nuevos pedidos aparecerán aquí automáticamente</p>
                    </div>
                <?php else: ?>
                    <?php foreach ($orders as $order): ?>
                    <div class="order-card <?= $order['status'] ?>" data-order-id="<?= $order['id'] ?>">
                        <div class="order-header">
                            <div class="order-code">#<?= e($order['order_code']) ?></div>
                            <div class="order-type">
                                <?php if ($order['order_type'] === 'physical'): ?>
                                    🏪 En Local
                                <?php else: ?>
                                    🚚 Domicilio
                                <?php endif; ?>
                            </div>
                        </div>
                        
                        <div class="customer-name">👤 <?= e($order['customer_name']) ?></div>
                        
                        <?php if ($order['address']): ?>
                            <div class="customer-name">📍 <?= e($order['address']) ?></div>
                        <?php endif; ?>
                        
                        <div class="order-meta">
                            <span><?= date('H:i', strtotime($order['created_at'])) ?></span>
                            <span class="status-badge <?= $order['status'] ?>">
                                <?php
                                $statusLabels = [
                                    'pending' => 'PENDIENTE',
                                    'preparing' => 'EN PREPARACIÓN', 
                                    'ready' => 'LISTO',
                                    'delivered' => 'ENTREGADO'
                                ];
                                echo $statusLabels[$order['status']] ?? 'PENDIENTE';
                                ?>
                            </span>
                        </div>
                        
                        <!-- Mostrar items del pedido -->
                        <div class="order-items">
                            <?php foreach ($order['items'] as $item): ?>
                                <div class="order-item">
                                    <span><?= $item['quantity'] ?>x <?= e($item['name']) ?></span>
                                    <span><?= formatCurrency($item['subtotal']) ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <div class="order-total">
                            <span><strong>Total:</strong></span>
                            <span class="total-amount"><?= formatCurrency($order['total']) ?></span>
                        </div>

                        <div class="order-total">
                            <span>Cola:</span>
                            <span class="status-badge status-<?= $order['queue_type'] ?>">
                                <?= ucfirst($order['queue_type']) ?>
                            </span>
                        </div>

                        <!-- Estado de Pago -->
                        <div class="order-total">
                            <span>Pago:</span>
                            <span class="payment-badge payment-<?= $order['payment_status'] ?? 'pending' ?>">
                                <?php 
                                $paymentStatus = $order['payment_status'] ?? 'pending';
                                echo getPaymentStatusEmoji($paymentStatus) . ' ' . getPaymentStatusText($paymentStatus);
                                ?>
                            </span>
                        </div>
                        
                        <div class="order-actions">
                            <?php if ($order['status'] === 'pending'): ?>
                                <button class="action-btn btn-primary" onclick="updateOrderStatus(<?= $order['id'] ?>, 'preparing')">🔥 Preparar</button>
                            <?php elseif ($order['status'] === 'preparing'): ?>
                                <button class="action-btn btn-success" onclick="updateOrderStatus(<?= $order['id'] ?>, 'ready')">✅ Listo</button>
                            <?php elseif ($order['status'] === 'ready'): ?>
                                <button class="action-btn btn-success" onclick="updateOrderStatus(<?= $order['id'] ?>, 'delivered')">📦 Entregar</button>
                            <?php endif; ?>
                            
                            <button class="action-btn btn-warning" onclick="printTicket(<?= $order['id'] ?>)" title="Imprimir Ticket">🖨️</button>
                            
                            <!-- Botones de Estado de Pago -->
                            <?php if (($order['payment_status'] ?? 'pending') !== 'paid'): ?>
                                <button class="action-btn btn-success" onclick="updatePaymentStatus(<?= $order['id'] ?>, 'paid')" title="Marcar como Pagado">💰 Pagado</button>
                            <?php endif; ?>
                            <?php if (($order['payment_status'] ?? 'pending') === 'pending'): ?>
                                <button class="action-btn btn-danger" onclick="updatePaymentStatus(<?= $order['id'] ?>, 'failed')" title="Marcar Pago Fallido">❌ Falló</button>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>

        <!-- Sección Gestión de Turnos -->
        <div id="queues-section" class="content-section">
            <h2>Gestión de Turnos por Fila</h2>
            <div class="orders-grid">
                <div class="order-card">
                    <h4>🧄 Fila Tradicional</h4>
                    <p>Buñuelos clásicos, con azúcar y mozarella</p>
                    <div class="order-total">
                        <span>Contador actual:</span>
                        <div class="stat-number" id="tradicionalCounter" style="font-size: 1.5rem;">
                            4
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="action-btn btn-danger" onclick="adjustQueue('tradicional', -1)">-1</button>
                        <button class="action-btn btn-success" onclick="adjustQueue('tradicional', 1)">+1</button>
                        <button class="btn btn-warning" onclick="resetQueue('tradicional')" style="margin-left: 10px;">Reset</button>
                    </div>
                </div>

                <div class="order-card">
                    <h4>⭐ Fila Especiales</h4>
                    <p>Buñuelos hawaianos, rancheros, mermelada, bocadillo, arequipe</p>
                    <div class="order-total">
                        <span>Contador actual:</span>
                        <div class="stat-number" id="especialesCounter" style="font-size: 1.5rem;">
                            4
                        </div>
                    </div>
                    <div class="order-actions">
                        <button class="action-btn btn-danger" onclick="adjustQueue('especiales', -1)">-1</button>
                        <button class="action-btn btn-success" onclick="adjustQueue('especiales', 1)">+1</button>
                        <button class="btn btn-warning" onclick="resetQueue('especiales')" style="margin-left: 10px;">Reset</button>
                    </div>
                </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
                <button class="btn btn-danger" onclick="resetAllQueues()">⚠️ Resetear Todas las Filas</button>
            </div>
        </div>
        
        <!-- Sección Impresora -->
        <div id="printer-section" class="content-section">
            <h2>Controles de Impresora JALPOS80U</h2>
            <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="testPrinter()">🖨️ Probar Impresora</button>
                <button class="btn btn-success" onclick="printDailyReport()">📊 Reporte del Día</button>
                <div class="status-indicator ready" id="printerStatus">
                    Estado: Listo para usar
                </div>
            </div>
        </div>
    </div>

    <script src="dashboard.js"></script>
</body>
</html>