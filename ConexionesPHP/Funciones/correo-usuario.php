<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
$sql = "SELECT id_usuario, correo FROM Usuarios ORDER BY correo ASC";
$resultado = $cn->query($sql);

if (!$resultado || $resultado->num_rows === 0) {
    echo "sin_usuarios";
    exit;
}

while ($fila = $resultado->fetch_assoc()) {
    echo "id_usuario:" . $fila['id_usuario'] . ",correo:" . $fila['correo'] . "\n";
}
?>
