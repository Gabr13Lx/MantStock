<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
require('../ConexionDB/conexion.php');

// Buscar por ID desde GET (para búsqueda por <select>)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "ID inválido"]);
        exit;
    }

    $stmt = $cn->prepare("SELECT id_categoria, nombre, descripcion FROM Categorias WHERE id_categoria = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Categoría no encontrada"]);
    } else {
        $categoria = $resultado->fetch_assoc();
        echo json_encode($categoria); // ✅ formato JSON
    }

    $stmt->close();
    $cn->close();
    exit;
}

// Buscar por ID desde POST (para botón de buscar por ID)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_categoria'])) {
    $id = intval($_POST['id_categoria']);
    if ($id <= 0) {
        exit("no-encontrado");
    }

    $stmt = $cn->prepare("SELECT nombre, descripcion FROM Categorias WHERE id_categoria = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 0) {
        $stmt->close();
        $cn->close();
        exit("no-encontrado");
    }

    $stmt->bind_result($nombre, $descripcion);
    $stmt->fetch();
    $stmt->close();
    $cn->close();

    // 🔙 Respuesta estilo clásico
    echo $nombre . "|" . $descripcion;
    exit;
}

// Si no llega ningún parámetro válido
http_response_code(400);
echo "Petición inválida";
exit;
?>
