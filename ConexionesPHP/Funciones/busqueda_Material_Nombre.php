<?php
// Activar reporte de errores para debugging (solo en desarrollo)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// Validar id_item válido
if (!isset($_POST['id_item']) || !is_numeric($_POST['id_item'])) {
    echo "no-encontrado";
    exit;
}

$id_item = intval($_POST['id_item']);

// Usar el nombre correcto de tabla y campo clave
// Por ejemplo, si la tabla se llama 'materiales' y el campo 'id_material'
$sql = "SELECT * FROM materiales WHERE id_material = ?";

$stmt = $cn->prepare($sql);
if (!$stmt) {
    echo "error-preparacion";
    exit;
}

$stmt->bind_param("i", $id_item);
$stmt->execute();

$res = $stmt->get_result();
if (!$res) {
    echo "error-ejecucion";
    exit;
}

if ($res->num_rows === 0) {
    echo "no-encontrado";
    exit;
}

$material = $res->fetch_assoc();

// Retornar JSON limpio y sin problemas de codificación
header('Content-Type: application/json; charset=utf-8');
echo json_encode($material, JSON_UNESCAPED_UNICODE);
