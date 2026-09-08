<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();

// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
$cn->set_charset("utf8mb4");

// Función para limpiar texto y evitar inyección XSS
function limpiarTexto($txt) {
    return trim(htmlspecialchars($txt, ENT_QUOTES, 'UTF-8'));
}

// Recibir y limpiar datos POST enviados desde el formulario
$nombre        = limpiarTexto($_POST['nombre'] ?? '');
$numero_serie  = limpiarTexto($_POST['numero_serie'] ?? '');
$cantidad      = intval($_POST['cantidad'] ?? 0);
$precio        = intval($_POST['precio'] ?? 0);
$ubicacion     = limpiarTexto($_POST['ubicacion'] ?? '');
$tipo_gestion  = limpiarTexto($_POST['tipo_gestion'] ?? '');
$planta        = limpiarTexto($_POST['planta_almacen'] ?? '');
$id_categoria  = intval($_POST['id_categoria'] ?? 0);
$descripcion   = limpiarTexto($_POST['descripcion'] ?? '');

// Validar que los campos obligatorios no estén vacíos o inválidos
if ($nombre === '' || $cantidad <= 0 || $tipo_gestion === '' || $planta === '' || $id_categoria <= 0 || $descripcion === '') {
    echo "faltan-datos-obligatorios";
    exit;
}

// Validar que el nombre del material no se repita dentro de la misma planta
$verificar_nombre = $cn->prepare("SELECT COUNT(*) FROM Materiales WHERE nombre = ? AND planta = ?");
$verificar_nombre->bind_param("ss", $nombre, $planta);
$verificar_nombre->execute();
$verificar_nombre->bind_result($existe_nombre);
$verificar_nombre->fetch();
$verificar_nombre->close();

if ($existe_nombre > 0) {
    echo "nombre-ya-registrado";
    exit;
}

// Validar que el número de serie no se repita dentro de la misma planta (si se proporcionó)
if ($numero_serie !== '') {
    $verificar_serie = $cn->prepare("SELECT COUNT(*) FROM Materiales WHERE numero_serie = ? AND planta = ?");
    $verificar_serie->bind_param("ss", $numero_serie, $planta); 
    $verificar_serie->execute();
    $verificar_serie->bind_result($existe_serie);
    $verificar_serie->fetch();
    $verificar_serie->close();

    if ($existe_serie > 0) {
        echo "numero_serie-ya-registrado";
        exit;
    }
}

// Registrar material
$sql = "INSERT INTO Materiales (nombre, descripcion, numero_serie, cantidad, ubicacion, id_categoria, planta, tipo_gestion, precio)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $cn->prepare($sql);
if (!$stmt) {
    echo "error-preparar-consulta: " . $cn->error;
    exit;
}

$stmt->bind_param("sssisissi", $nombre, $descripcion, $numero_serie, $cantidad, $ubicacion, $id_categoria, $planta, $tipo_gestion, $precio);

if (!$stmt->execute()) {
    echo "error-al-insertar";
    exit;
}

$id_material = $cn->insert_id;
$stmt->close();

// Procesar imagen si se subió
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
    $archivo = $_FILES['imagen'];
    $permitidos = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!in_array($archivo['type'], $permitidos)) {
        echo "formato-no-permitido";
        exit;
    }

    $extension = strtolower(pathinfo($archivo['name'], PATHINFO_EXTENSION));

    // Sanitizar nombre para imagen
    $nombre_sanitizado = preg_replace('/[^A-Za-z0-9 ]/', '', $nombre);
    $nombre_base = str_replace(' ', '-', trim($nombre_sanitizado));
    $nombre_imagen_final = $nombre_base . $id_material . "." . $extension;

    $ruta_destino = __DIR__ . "/../../uploads/productos/" . $nombre_imagen_final;

    if (!move_uploaded_file($archivo['tmp_name'], $ruta_destino)) {
        echo "error-al-subir-imagen";
        exit;
    }

    chmod($ruta_destino, 0644);

    // Actualizar imagen en la base de datos
    $update = $cn->prepare("UPDATE Materiales SET imagen = ? WHERE id_material = ?");
    if (!$update) {
        echo "error-preparar-update";
        exit;
    }
    $update->bind_param("si", $nombre_imagen_final, $id_material);
    $update->execute();
    $update->close();
}

$cn->close();
echo "ok";
?>
