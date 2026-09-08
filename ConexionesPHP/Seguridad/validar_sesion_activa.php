<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
header('Content-Type: application/json'); // Asegura respuesta JSON
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// Conexión a la base de datos
require('../ConexionDB/conexion.php');
if ($cn->connect_errno) {
    echo json_encode(["estado" => "conexion-fallida"]);
    exit;
}

// Obtener el ID del usuario desde la sesión
$id_usuario_sesion = $_SESSION['usuario'];

// Verificar que el usuario esté activo
$sql_estado = "SELECT estado FROM Usuarios WHERE id_usuario = ? LIMIT 1";
$stmt_estado = $cn->prepare($sql_estado);
$stmt_estado->bind_param("i", $id_usuario_sesion);
$stmt_estado->execute();
$resultado_estado = $stmt_estado->get_result();

// Validar resultado
if ($resultado_estado->num_rows === 0 || $resultado_estado->fetch_assoc()['estado'] !== 'Activo') {
    session_destroy();
    echo json_encode(["estado" => "usuario-inactivo"]);
    exit;
}

// Usuario válido
echo json_encode(["estado" => "ok"]);
