<?php
session_start();
require('../ConexionDB/conexion.php');

// Validación de sesión activa
if (!isset($_SESSION['usuario'])) {
    exit("error-sesion");
}

$id_usuario = $_SESSION['usuario'];

// === Sanitización de filtros ===
$nombre_material = isset($_POST['nombre_material']) ? trim($_POST['nombre_material']) : '';
$planta          = isset($_POST['Ubicacion_almacen']) ? $_POST['Ubicacion_almacen'] : 'todos';
$id_categoria     = isset($_POST['id_categoria']) ? $_POST['id_categoria'] : '';
$fecha_inicio     = isset($_POST['fecha_inicio']) ? $_POST['fecha_inicio'] : '';
$fecha_fin        = isset($_POST['fecha_fin']) ? $_POST['fecha_fin'] : '';
$tipo             = isset($_POST['tipo']) ? $_POST['tipo'] : 'todos';

// === Filtros dinámicos ===
$where = ['mo.id_usuario = ?'];
$params = [$id_usuario];
$types  = 'i';

if ($nombre_material !== '') {
    $where[] = 'm.nombre LIKE ?';
    $params[] = "%$nombre_material%";
    $types .= 's';
}

if ($id_categoria !== '') {
    $where[] = 'c.id_categoria = ?';
    $params[] = (int)$id_categoria;
    $types .= 'i';
}

if ($planta !== 'todos') {
    $where[] = 'mo.planta_movimiento = ?';
    $params[] = $planta;
    $types .= 's';
}

if ($fecha_inicio !== '' && $fecha_fin !== '') {
    $where[] = 'DATE(mo.fecha_movimiento) BETWEEN ? AND ?';
    $params[] = $fecha_inicio;
    $params[] = $fecha_fin;
    $types .= 'ss';
}

if ($tipo !== 'todos') {
    $where[] = 'mo.tipo = ?';
    $params[] = $tipo;
    $types .= 's';
}

// === Consulta SQL ajustada (sin info de usuario) ===
$sql = "
SELECT 
    m.imagen,
    m.nombre AS nombre_material,
    mo.cantidad,
    mo.tipo,
    mo.planta_movimiento,
    mo.fecha_movimiento,
    c.nombre AS nombre_categoria,
    mo.descripcion_salida,
    mo.observaciones
FROM Movimientos mo
INNER JOIN Materiales m ON mo.id_material = m.id_material
INNER JOIN Categorias c ON m.id_categoria = c.id_categoria
WHERE " . implode(' AND ', $where) . "
ORDER BY mo.fecha_movimiento DESC
";

$stmt = $cn->prepare($sql);
if (!$stmt) {
    exit("error-consulta");
}

$stmt->bind_param($types, ...$params);
$stmt->execute();
$resultado = $stmt->get_result();

// === Generar tabla HTML solo con columnas visibles ===
if ($resultado->num_rows > 0) {
    while ($row = $resultado->fetch_assoc()) {
        echo "<tr>";
        echo "<td><img src='../uploads/productos/" . htmlspecialchars($row['imagen']) . "' width='60' height='60' class='img-thumbnail' alt='Imagen'></td>";
        
        // Nombre del material: salto de línea cada 2 palabras
        $nombre_material = htmlspecialchars($row['nombre_material']);
        $nombre_material = preg_replace('/((?:\S+\s+){2})/', "$1<br>", $nombre_material);
        echo "<td>" . $nombre_material . "</td>";

        echo "<td>" . htmlspecialchars($row['cantidad']) . "</td>";
        echo "<td class='text-capitalize'>" . htmlspecialchars($row['tipo']) . "</td>";

        // Planta
        echo "<td>" . htmlspecialchars($row['planta_movimiento']) . "</td>";

        echo "<td>" . date("d/m/Y H:i", strtotime($row['fecha_movimiento'])) . "</td>";
        
        // Categoría: salto de línea cada 2 palabras
        $categoria = htmlspecialchars($row['nombre_categoria']);
        $categoria = preg_replace('/((?:\S+\s+){2})/', "$1<br>", $categoria);
        echo "<td>" . $categoria . "</td>";

        $descripcion = htmlspecialchars($row['descripcion_salida']);
        $descripcion = wordwrap($descripcion, 30, "<br>", true);

        $observaciones = htmlspecialchars($row['observaciones']);
        $observaciones = wordwrap($observaciones, 30, "<br>", true);

        echo "<td>" . $descripcion . "</td>";
        echo "<td>" . $observaciones . "</td>";
        echo "</tr>";
    }
} else {
    echo "<tr><td colspan='8' class='text-center text-muted'>No se encontraron resultados con los filtros aplicados.</td></tr>";
}

$stmt->close();
$cn->close();
?>
