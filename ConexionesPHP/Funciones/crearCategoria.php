<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// === Sanitizar y obtener datos enviados por POST ===
$nombre = trim($_POST['nombre'] ?? '');
$descripcion = trim($_POST['descripcion'] ?? '');

if ($nombre === '') {
    exit("faltan-datos"); // Validar que el nombre no esté vacío
}

// === Verificar si ya existe una categoría con el mismo nombre (case insensitive) ===
$sql_check = "SELECT id_categoria FROM Categorias WHERE LOWER(nombre) = LOWER(?) LIMIT 1";
$stmt_check = $cn->prepare($sql_check);
$stmt_check->bind_param("s", $nombre);
$stmt_check->execute();
$stmt_check->store_result();

if ($stmt_check->num_rows > 0) {
    $stmt_check->close();
    exit("existe"); // Nombre de categoría ya existe
}
$stmt_check->close();

// === Insertar la nueva categoría ===
$sql_insert = "INSERT INTO Categorias (nombre, descripcion) VALUES (?, ?)";
$stmt_insert = $cn->prepare($sql_insert);

if (!$stmt_insert) {
    exit("error-preparar"); // Error al preparar la consulta
}

$stmt_insert->bind_param("ss", $nombre, $descripcion);

if ($stmt_insert->execute()) {
    echo "exito"; // Inserción exitosa
} else {
    echo "error-insertar"; // Error en ejecución
}

$stmt_insert->close();
$cn->close();
?>
