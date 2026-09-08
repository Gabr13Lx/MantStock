<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
// Obtener datos recibidos por POST
$correo = $_POST['correo'] ?? '';
$nuevo_estado = $_POST['nuevo_estado'] ?? '';

// Validar conexión, datos recibidos y estado válido
if (!$cn->connect_errno && !empty($correo) && ($nuevo_estado === 'Activo' || $nuevo_estado === 'Inactivo')) {

    // Escapar variables para prevenir inyección SQL (aunque controlas formulario)
    $correo = $cn->real_escape_string($correo);
    $nuevo_estado = $cn->real_escape_string($nuevo_estado);

    // Consulta para actualizar estado del usuario
    $sql = "UPDATE Usuarios SET estado = '$nuevo_estado' WHERE correo = '$correo'";

    // Ejecutar consulta y responder según resultado
    echo ($cn->query($sql)) ? "ok" : "error";

    $cn->close();

} else {
    echo "error"; // Datos inválidos o fallo de conexión
}
?>
