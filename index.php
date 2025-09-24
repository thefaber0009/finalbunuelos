<?php
require_once 'config/config.php';
require_once 'includes/auth.php';
require_once 'includes/helpers.php';

$menuItems = getMenuItems();
$traditionalItems = array_filter($menuItems, fn($item) => $item['category'] === 'traditional');
$specialItems = array_filter($menuItems, fn($item) => $item['category'] === 'special');
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Buñuelos - Sistema de Pedidos</title>
    
    <!-- Base CSS -->
    <link rel="stylesheet" href="public/css/app.css">
    
    <!-- Panel-specific CSS -->
    <link rel="stylesheet" href="public/css/panels/order-type.css">
    <link rel="stylesheet" href="public/css/panels/customer-info.css">
    <link rel="stylesheet" href="public/css/panels/menu.css">
    <link rel="stylesheet" href="public/css/panels/delivery.css">
    <link rel="stylesheet" href="public/css/panels/summary.css">
</head>


<script>
// Vigilante de vistas - previene solapamiento
setInterval(() => {
    const views = ['deliveryView', 'summaryView'];
    let visibleCount = 0;
    let lastVisible = null;
    
    views.forEach(viewId => {
        const view = document.getElementById(viewId);
        if (view && view.style.display === 'block') {
            visibleCount++;
            lastVisible = viewId;
        }
    });
    
    if (visibleCount > 1) {
        // Si hay más de una vista visible, ocultar todas excepto la última
        views.forEach(viewId => {
            const view = document.getElementById(viewId);
            if (view && viewId !== lastVisible) {
                view.style.display = 'none';
            }
        });
        console.log('Conflicto de vistas resuelto, manteniendo:', lastVisible);
    }
}, 50);
</script>
<body>
    <div id="app">
        <!-- AGREGAR ESTE SCRIPT AQUÍ -->
        <script>
        // Prevenir conflicto con el div id="app"
        window.appState = {
            customerName: '',
            orderType: '',
            quantities: {},
            deliveryData: null,
            orderCode: '',
            showView: function(viewId) {
                console.log('Switching to view:', viewId);
                document.querySelectorAll('.view').forEach(view => {
                    view.style.display = 'none';
                });
                const targetView = document.getElementById(viewId);
                if (targetView) {
                    targetView.style.display = 'block';
                    console.log('View switched successfully to:', viewId);
                } else {
                    console.error('View not found:', viewId);
                }
            }
        };

        // Evitar que app sea sobrescrito por el DOM
        Object.defineProperty(window, 'app', {
            get: function() { return window.appState; },
            set: function(value) { 
                if (value && typeof value === 'object' && !value.tagName) {
                    window.appState = value; 
                }
            }
        });

        console.log('AppState initialized:', window.appState);
        </script>

        <!-- Include all panels -->
        <?php include 'views/panels/order-type-panel.php'; ?>
        <?php include 'views/panels/customer-info-panel.php'; ?>
        <?php include 'views/panels/menu-panel.php'; ?>
        <?php include 'views/panels/delivery-panel.php'; ?>
        <?php include 'views/panels/summary-panel.php'; ?>
    </div>

    <!-- Global JavaScript variables -->
    <script>
        // Menu items data
        // Menu items data
        window.menuItems = <?= json_encode($menuItems) ?>;
        
        // CSRF token for API calls
        window.CSRF_TOKEN = '<?= Auth::getCSRFToken() ?>';

        
    </script>
    
    <!-- Main app JavaScript -->
    <script src="public/js/app.js"></script>
    
    <!-- Panel-specific JavaScript -->
    <script src="public/js/panels/order-type.js"></script>
    <script src="public/js/panels/customer-info.js"></script>
    <script src="public/js/panels/menu.js"></script>
    <script src="public/js/panels/delivery.js"></script>
    <script src="public/js/panels/summary.js"></script>

    
</body>

</html>