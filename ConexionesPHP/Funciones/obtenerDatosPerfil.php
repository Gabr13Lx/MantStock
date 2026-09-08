<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
// Obtener id_usuario desde sesión
$id = intval($_SESSION['usuario']);

// Preparar consulta segura para obtener datos del usuario
$consulta = $cn->prepare("SELECT id_usuario, primer_nombre, primer_apellido, correo, rol FROM Usuarios WHERE id_usuario = ?");
$consulta->bind_param("i", $id);
$consulta->execute();
$consulta->store_result();

// Validar existencia del usuario
if ($consulta->num_rows === 0) {
    $consulta->close();
    echo "no-encontrado";
    exit;
}

// Obtener resultados en variables
$consulta->bind_result($id_usuario, $nombre, $apellido, $correo, $rol);
$consulta->fetch();
$consulta->close();
$cn->close();

// Salida concatenada sin JSON, separada por "|"
echo $id_usuario . "|" . $nombre . "|" . $apellido . "|" . $correo . "|" . $rol;
?>
