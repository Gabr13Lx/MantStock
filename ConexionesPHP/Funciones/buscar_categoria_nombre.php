<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();

// Conexión con la base de datos
require('../ConexionDB/conexion.php');

// Obtener y validar el nombre recibido por POST
$nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';

if (strlen($nombre) < 2) {
    echo json_encode([]); // Muy corto, sin buscar
    exit;
}

// Consulta segura con LIKE para encontrar coincidencias por nombre
$stmt = $cn->prepare("SELECT id_categoria, nombre FROM Categorias WHERE nombre LIKE CONCAT('%', ?, '%') ORDER BY nombre ASC LIMIT 10");
$stmt->bind_param("s", $nombre);
$stmt->execute();
$result = $stmt->get_result();

// Convertir resultados a arreglo asociativo
$categorias = [];
while ($fila = $result->fetch_assoc()) {
    $categorias[] = [
        'id_categoria' => $fila['id_categoria'],
        'nombre' => $fila['nombre']
    ];
}

// Cerrar conexión y devolver JSON
$stmt->close();
$cn->close();

echo json_encode($categorias);
?>
