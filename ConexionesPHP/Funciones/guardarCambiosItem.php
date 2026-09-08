<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// Validar y obtener ID del material a actualizar
$id_material = intval($_POST['id_item'] ?? 0); // Si quieres, renombra en el frontend a id_material
if ($id_material <= 0) {
    echo "no-encontrado";
    exit;
}

// Obtener datos actuales del material
$sql = "SELECT nombre, descripcion, numero_serie, cantidad, ubicacion, id_categoria, tipo_gestion, imagen, precio, planta FROM Materiales WHERE id_material = ?";
$stmt = $cn->prepare($sql);
$stmt->bind_param("i", $id_material);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "no-encontrado";
    exit;
}

$actual = $result->fetch_assoc();
$stmt->close();

$campos_actualizar = [];

// Verificar qué campos han cambiado y agregarlos al array de actualización (excepto imagen)
if (isset($_POST['nombre'])) {
    $nuevo_nombre = trim($_POST['nombre']);

    // Solo si el nombre cambió respecto al actual
    if ($nuevo_nombre !== $actual['nombre']) {
        // Verificar si ya existe otro material con ese mismo nombre (excluyendo el actual)
        $sql_nombre = "SELECT id_material FROM Materiales WHERE LOWER(nombre) = LOWER(?) AND id_material != ?";
        $stmt_nombre = $cn->prepare($sql_nombre);
        $stmt_nombre->bind_param("si", $nuevo_nombre, $id_material);
        $stmt_nombre->execute();
        $resultado_nombre = $stmt_nombre->get_result();

        if ($resultado_nombre->num_rows > 0) {
            echo "nombre-repetido";
            exit;
        }

        $stmt_nombre->close();

        // Si no hay duplicado, se registra para actualizar
        $campos_actualizar['nombre'] = $nuevo_nombre;
    }
}

if (isset($_POST['descripcion']) && $_POST['descripcion'] !== $actual['descripcion']) {
    $campos_actualizar['descripcion'] = $_POST['descripcion'];
}

if (isset($_POST['numero_serie'])) {
    $nuevo_numero_serie = trim($_POST['numero_serie']);

    // Solo validamos si el número de serie NO está vacío
    if ($nuevo_numero_serie !== "") {
        // Validar si ya existe otro material con ese mismo número de serie
        $sql_serie = "SELECT id_material FROM Materiales WHERE LOWER(numero_serie) = LOWER(?) AND id_material != ?";
        $stmt_serie = $cn->prepare($sql_serie);
        $stmt_serie->bind_param("si", $nuevo_numero_serie, $id_material);
        $stmt_serie->execute();
        $resultado_serie = $stmt_serie->get_result();

        if ($resultado_serie->num_rows > 0) {
            echo "numero-serie-repetido";
            exit;
        }

        $stmt_serie->close();
    }

    // Si pasó la validación, verificar si cambió respecto al actual
    if ($nuevo_numero_serie !== $actual['numero_serie']) {
        $campos_actualizar['numero_serie'] = $nuevo_numero_serie;
    }
}


if (isset($_POST['cantidad']) && intval($_POST['cantidad']) !== intval($actual['cantidad'])) {
    $campos_actualizar['cantidad'] = intval($_POST['cantidad']);
}
if (isset($_POST['ubicacion']) && $_POST['ubicacion'] !== $actual['ubicacion']) {
    $campos_actualizar['ubicacion'] = $_POST['ubicacion'];
}
if (isset($_POST['id_categoria']) && intval($_POST['id_categoria']) !== intval($actual['id_categoria'])) {
    $campos_actualizar['id_categoria'] = intval($_POST['id_categoria']);
}
if (isset($_POST['tipo_gestion']) && $_POST['tipo_gestion'] !== $actual['tipo_gestion']) {
    $campos_actualizar['tipo_gestion'] = $_POST['tipo_gestion'];
}

// Guardar planta nueva (si cambió)
if (isset($_POST['Ubicacion_almacen']) && $_POST['Ubicacion_almacen'] !== $actual['planta']) {
    $campos_actualizar['planta'] = $_POST['Ubicacion_almacen'];
}

// Validar duplicados en la nueva planta (si se quiere cambiar)
if (isset($campos_actualizar['planta'])) {
    $nueva_planta = $campos_actualizar['planta'];

    $nombre_verificar = isset($campos_actualizar['nombre']) ? $campos_actualizar['nombre'] : $actual['nombre'];
    $sql_nombre_planta = "SELECT id_material FROM Materiales WHERE LOWER(nombre) = LOWER(?) AND planta = ? AND id_material != ?";
    $stmt_nombre_planta = $cn->prepare($sql_nombre_planta);
    $stmt_nombre_planta->bind_param("ssi", $nombre_verificar, $nueva_planta, $id_material);
    $stmt_nombre_planta->execute();
    $res_nombre_planta = $stmt_nombre_planta->get_result();
    if ($res_nombre_planta->num_rows > 0) {
        echo "material-ya-existen-en-planta";
        exit;
    }
    $stmt_nombre_planta->close();

    $serie_verificar = isset($campos_actualizar['numero_serie']) ? $campos_actualizar['numero_serie'] : $actual['numero_serie'];
    if ($serie_verificar !== '') {
        $sql_serie_planta = "SELECT id_material FROM Materiales WHERE LOWER(numero_serie) = LOWER(?) AND planta = ? AND id_material != ?";
        $stmt_serie_planta = $cn->prepare($sql_serie_planta);
        $stmt_serie_planta->bind_param("ssi", $serie_verificar, $nueva_planta, $id_material);
        $stmt_serie_planta->execute();
        $res_serie_planta = $stmt_serie_planta->get_result();
        if ($res_serie_planta->num_rows > 0) {
            echo "material-ya-existen-en-planta";
            exit;
        }
        $stmt_serie_planta->close();
    }
}

if (isset($_POST['precio']) && floatval($_POST['precio']) != floatval($actual['precio'])) {
    $campos_actualizar['precio'] = floatval($_POST['precio']);
}
// --- Procesar imagen subida ---
$uploadDir = '../../uploads/productos/';
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
    $valid_mimes = ['image/jpeg', 'image/png', 'image/gif'];
    $ext_permitidas = ['jpg', 'jpeg', 'png', 'gif'];

    $mime = $_FILES['imagen']['type'];
    $ext = strtolower(pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION));

    if (!in_array($mime, $valid_mimes) || !in_array($ext, $ext_permitidas)) {
        echo "tipo-imagen-no-valido";
        exit;
    }

    // Nombre base para la imagen limpia y segura
    $nombreBase = preg_replace('/[^a-zA-Z0-9_-]/', '', str_replace(' ', '-', $actual['nombre']));
    $nuevoNombreImagen = $nombreBase . '+' . $id_material . '.' . $ext;
    $rutaDestino = $uploadDir . $nuevoNombreImagen;

    // Eliminar imagen anterior si no es fallback.png y existe
    if (
        !empty($actual['imagen']) &&
        $actual['imagen'] !== 'fallback.png' &&
        file_exists($uploadDir . $actual['imagen'])
    ) {
        unlink($uploadDir . $actual['imagen']);
    }

    // Mover imagen subida al destino
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaDestino)) {
        chmod($rutaDestino, 0644);
        $campos_actualizar['imagen'] = $nuevoNombreImagen;
    } else {
        echo "error-subir-imagen";
        exit;
    }
}

// Validar que haya al menos un cambio real
if (count($campos_actualizar) === 0) {
    echo "sin-cambios";
    exit;
}

// Construir la consulta UPDATE dinámica
$sets = [];
$valores = [];
$tipos = "";

foreach ($campos_actualizar as $campo => $valor) {
    $sets[] = "$campo = ?";
    $tipos .= is_int($valor) ? "i" : "s";
    $valores[] = $valor;
}

$sql_update = "UPDATE Materiales SET " . implode(", ", $sets) . " WHERE id_material = ?";
$tipos .= "i";
$valores[] = $id_material;

$stmt = $cn->prepare($sql_update);
if (!$stmt) {
    echo "error-sql";
    exit;
}

$stmt->bind_param($tipos, ...$valores);

if ($stmt->execute()) {
    echo "exito";
} else {
    echo "error-actualizar";
}

$stmt->close();
$cn->close();
?>
