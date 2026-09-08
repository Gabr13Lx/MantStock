<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
$correo_usr = $_SESSION['correo'] ?? '';

if (!$cn->connect_errno) {
    $busqueda = $cn->query("SELECT id_usuario FROM Usuarios WHERE correo = '".$correo_usr."'");
    if ($busqueda->num_rows > 0 && $busqueda->num_rows < 2) {
        $id_usuario = $busqueda->fetch_array();
        echo $id_usuario[0];
    } else {
        echo ("Error-Busqueda");
    }
    $cn->close();
} else {
    echo "Fallo la Conexión: " . $cn->connect_error;
}
?>
