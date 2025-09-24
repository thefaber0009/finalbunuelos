<?php

require_once 'config/config.php';
require_once 'includes/db.php';      // ¡Agregar esta línea!
require_once 'includes/auth.php';

// Redirect if already logged in
if (Auth::isLoggedIn()) {
    header('Location: admin/dashboard.php');
    exit;
}

$error = '';

if ($_POST) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    $csrf_token = $_POST['csrf_token'] ?? '';
    
    if (!Auth::validateCSRF($csrf_token)) {
        $error = 'Token de seguridad inválido';
    } elseif (Auth::login($username, $password)) {
        header('Location: admin/dashboard.php');
        exit;
    } else {
        $error = 'Usuario o contraseña incorrectos';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Login</title>
    <link rel="stylesheet" href="public/css/app.css">
</head>
<body>
    <div class="container-sm" style="padding-top: 3rem;">
        <div class="card">
            <div class="text-center mb-6">
                <h1>🧄 Admin Buñuelos</h1>
                <p>Acceso para administradores</p>
            </div>
            
            <?php if ($error): ?>
                <div class="alert alert-error mb-4">
                    <?= htmlspecialchars($error) ?>
                </div>
            <?php endif; ?>
            
            <form method="POST">
                <input type="hidden" name="csrf_token" value="<?= Auth::getCSRFToken() ?>">
                
                <div class="form-group">
                    <label class="form-label" for="username">Usuario</label>
                    <input type="text" id="username" name="username" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">Contraseña</label>
                    <input type="password" id="password" name="password" class="form-input" required>
                </div>
                
                <button type="submit" class="btn btn-block btn-lg">Ingresar</button>
            </form>
            
            <div class="text-center mt-4">
                <a href="index.php" class="btn btn-outline">← Volver al inicio</a>
            </div>
        </div>
    </div>
</body>
</html>