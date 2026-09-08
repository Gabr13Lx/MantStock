<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

if (!$cn->connect_errno) {
    // Consulta para obtener el primer nombre según el id de usuario en sesión
    $busqueda = $cn->query("SELECT primer_nombre FROM Usuarios WHERE id_usuario = '".$_SESSION['usuario']."'");
    
    if ($busqueda->num_rows === 1) {
        $nombre = $busqueda->fetch_array();
        echo $nombre[0]; // Mostrar el primer nombre del usuario
    } else {
        echo "Sin-sesion"; // No se encontró el usuario o sesión inválida
    }
    
    $cn->close();
} else {
    echo "Fallo la Conexión: " . $cn->connect_error; // Error al conectar con BD
}
?>
