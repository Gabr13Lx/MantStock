<?php
session_start();

// === Vaciar todos los datos de la sesión ===
$_SESSION = [];

// === Eliminar la cookie de sesión si se usa ===
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// === Liberar recursos y destruir sesión ===
session_unset();
$destruida = session_destroy();

// === Verificar que la sesión haya sido destruida correctamente ===
if ($destruida && session_status() === PHP_SESSION_NONE) {
    echo "cerrado"; // Sesión cerrada exitosamente
} else {
    echo "no-cerrado"; // Error al cerrar sesión
}
exit;
?>
