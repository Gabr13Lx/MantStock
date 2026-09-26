<?php
/**
 * buscarItemPorID.php
 * Endpoint para buscar un ítem del inventario por su ID.
 *
 * @author  Angel Eli Bonifacio Galvez
 * @team    MantStock
 */

session_start();
require('../ConexionDB/conexion.php');

$nombre = trim($_POST['nombre'] ?? '')
if ($nombre === '') {
    echo json_encode(["error" => "Por favor, escribe el nombre del material para buscar."]);
    exit;
}

if (mb_strlen($nombre) < 2) {
    echo json_encode(["error" => "Debes ingresar al menos 2 caracteres para realizar la búsqueda."]);
    exit;
}

$ubicacion = trim($_POST['ubicacion'] ?? '');
if ($ubicacion === '') {
    echo json_encode(["error" => "Debes seleccionar la Planta del almacén."]);
    exit;
}

// Validar lista de plantas permitidas
$plantas_validas = ["Agua", "Latas", "Jugos", "Todos"];
if (!in_array($ubicacion, $plantas_validas)) {
    echo json_encode(["error" => "La planta seleccionada no es válida."]);
    exit;
}

// Consulta con o sin filtro de planta
if ($ubicacion === "Todos") {
    $sql = "SELECT id_material, nombre
            FROM Materiales
            WHERE nombre LIKE CONCAT('%', ?, '%')
            ORDER BY nombre ASC
            LIMIT 15";
    $stmt = $cn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => "Ocurrió un error interno al preparar la búsqueda."]);
        exit;
    }
    $stmt->bind_param("s", $nombre);
} else {
    $sql = "SELECT id_material, nombre
            FROM Materiales
            WHERE nombre LIKE CONCAT('%', ?, '%')
            AND planta = ?
            ORDER BY nombre ASC
            LIMIT 15";
    $stmt = $cn->prepare($sql);
    if (!$stmt) {
        echo json_encode(["error" => "Ocurrió un error interno al preparar la búsqueda."]);
        exit;
    }
    $stmt->bind_param("ss", $nombre, $ubicacion);
}

$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["error" => "No se encontraron materiales que coincidan con ese nombre."]);
    exit;
}

$materiales = [];
while ($fila = $resultado->fetch_assoc()) {
    $materiales[] = [
        "id_item" => $fila['id_material'],
        "nombre" => $fila['nombre']
    ];
}

echo json_encode(["materiales" => $materiales], JSON_UNESCAPED_UNICODE);

$stmt->close();
$cn->close();
