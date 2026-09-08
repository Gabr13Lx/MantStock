<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

$id_usuario = $_SESSION['usuario'];
$nueva_contrasena = isset($_POST['nueva_contrasena']) ? trim($_POST['nueva_contrasena']) : '';
$actual_contrasena = isset($_POST['actual_contrasena']) ? trim($_POST['actual_contrasena']) : '';

if ($nueva_contrasena === '' || $actual_contrasena === '') {
    echo "datos-incompletos";
    exit;
}

// Obtener contraseña actual (hash) de BD
$stmt = $cn->prepare("SELECT contrasena FROM Usuarios WHERE id_usuario = ?");
$stmt->bind_param("i", $id_usuario);
$stmt->execute();
$stmt->bind_result($contrasena_actual_db);
$stmt->fetch();
$stmt->close();

// Verificar que la contraseña actual proporcionada coincida con el hash almacenado
if (!password_verify($actual_contrasena, $contrasena_actual_db)) {
    echo "contraseña-incorrecta";
    exit;
}

// Hashear la nueva contraseña antes de guardar
$nueva_contrasena_hash = password_hash($nueva_contrasena, PASSWORD_BCRYPT);

// Actualizar contraseña con el hash nuevo
$stmt = $cn->prepare("UPDATE Usuarios SET contrasena = ? WHERE id_usuario = ?");
$stmt->bind_param("si", $nueva_contrasena_hash, $id_usuario);
if ($stmt->execute()) {
    echo "ok";
} else {
    echo "error-actualizacion";
}
$stmt->close();
$cn->close();
?>
