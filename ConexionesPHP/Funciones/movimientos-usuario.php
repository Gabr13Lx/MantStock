<?php
// ========================== INICIO DE SESIÓN ==========================
session_start();

// ========================== CONEXIÓN BASE DE DATOS ==========================
require('../ConexionDB/conexion.php');

// ========================== VALIDACIÓN DE ENTRADA ==========================
$accion = $_POST['accion'] ?? '';
$ubicacion = $_POST['plan_ubicacion'] ?? '';
$categoria_busqueda = $_POST['categoria_busqueda'] ?? '';

// ========================== ACCIÓN: BUSCAR MATERIALES ==========================
if ($accion === 'buscar') {
    $plantas_validas = ["Agua", "Latas", "Jugos", "Todos"];

    // Validación de planta
    if (!in_array($ubicacion, $plantas_validas)) {
        echo json_encode(["error" => "La planta seleccionada no es válida."]);
        exit;
    }

    // Validación de término
    if (!isset($_POST['termino']) || trim($_POST['termino']) === '') {
        echo "";
        exit;
    }

    $termino = '%' . $cn->real_escape_string(trim($_POST['termino'])) . '%';

    // Construcción de consulta dinámica
    $sql = "SELECT 
                M.id_material,
                M.nombre,
                M.cantidad,
                M.numero_serie,
                M.descripcion,
                M.planta,
                M.ubicacion,
                M.imagen,
                C.nombre AS categoria
            FROM Materiales M
            INNER JOIN Categorias C ON M.id_categoria = C.id_categoria
            WHERE M.nombre LIKE ?";

    $params = [];
    $tipos = "s"; // por el LIKE

    // Filtro planta (si no es "Todos")
    if ($ubicacion !== "Todos") {
        $sql .= " AND M.planta = ?";
        $params[] = $ubicacion;
        $tipos .= "s";
    }

    // Filtro categoría (si no es "Todos")
    if ($categoria_busqueda !== "Todos") {
        $sql .= " AND M.id_categoria = ?";
        $params[] = $categoria_busqueda;
        $tipos .= "i";
    }

    $sql .= " ORDER BY M.nombre ASC LIMIT 25";

    // Preparar consulta
    $stmt = $cn->prepare($sql);
    if (!$stmt) {
        echo "error-sql: " . $cn->error;
        exit;
    }

    $params = array_merge([$termino], $params);
    $stmt->bind_param($tipos, ...$params);

    // Ejecutar
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows === 0) {
        echo "<tr><td colspan='9'>No se encontraron materiales.</td></tr>";
        exit;
    }

    while ($row = $resultado->fetch_assoc()) {
        // --- FUNCIONES DE FORMATEO ---
        function formatearTexto($texto, $palabras_corte, $caracteres_corte)
        {
            $texto = trim($texto ?? '');
            if ($texto === '') return '';

            $palabras = explode(" ", $texto);
            $nuevoTexto = "";
            $contadorPalabras = 0;
            foreach ($palabras as $palabra) {
                // Si la palabra es muy larga → cortar por caracteres
                if (strlen($palabra) > $caracteres_corte) {
                    $trozos = str_split($palabra, $caracteres_corte);
                    foreach ($trozos as $t) {
                        $nuevoTexto .= htmlspecialchars($t) . "<br>";
                    }
                } else {
                    $nuevoTexto .= htmlspecialchars($palabra) . " ";
                    $contadorPalabras++;
                    if ($contadorPalabras % $palabras_corte === 0) {
                        $nuevoTexto .= "<br>";
                    }
                }
            }
            return trim($nuevoTexto);
        }

        // --- NOMBRE (cada 3 palabras o 20 caracteres) ---
        $nombre = formatearTexto($row['nombre'], 3, 20);

        // --- NÚMERO DE SERIE (cada 3 palabras o 20 caracteres) ---
        if (!empty($row['numero_serie'])) {
            $numero_serie = formatearTexto($row['numero_serie'], 3, 20);
        } else {
            $numero_serie = "Sin número de serie registrado";
        }

        // --- UBICACIÓN (cada 3 palabras o 20 caracteres) ---
        if (!empty($row['ubicacion'])) {
            $ubicacion = formatearTexto($row['ubicacion'], 3, 20);
        } else {
            $ubicacion = "Sin ubicación física registrada";
            $ubicacion = formatearTexto($ubicacion, 2, 20); // este mensaje sigue tu lógica original (cada 2 palabras)
        }

        // --- DESCRIPCIÓN (cada 7 palabras o 30 caracteres) ---
        $descripcion = formatearTexto($row['descripcion'], 10, 40);

        // --- IMPRIMIR FILA ---
        echo "<tr>
        <td><img src='../uploads/productos/" . htmlspecialchars($row['imagen']) . "' width='50' class='img-thumbnail'></td>
        <td>$nombre</td>
        <td>" . htmlspecialchars($row['categoria']) . "</td>
        <td>" . intval($row['cantidad']) . "</td>
        <td>$numero_serie</td>
        <td>" . htmlspecialchars($row['planta']) . "</td>
        <td>$ubicacion</td>
        <td>$descripcion</td>
        <td><button class='btn btn-primary btn-sm' onclick='mostrarFormularioMovimiento(" . intval($row['id_material']) . ")'>Mover</button></td>
    </tr>";
    }



    exit;
}


// ========================== ACCIÓN: REGISTRAR MOVIMIENTO ==========================
if ($accion === 'registrar') {
    // Obtener ID del usuario en sesión
    $id_usuario = $_SESSION['usuario'];

    // Sanitización de datos del formulario
    $tipo = $_POST['tipo'] ?? '';
    $cantidad = intval($_POST['cantidad'] ?? 0);
    $descripcion_salida = trim($_POST['descripcion_salida'] ?? '');
    $observaciones = trim($_POST['observaciones'] ?? '');
    $id_material = intval($_POST['id_material'] ?? 0);

    // Validación de campos obligatorios
    if (!in_array($tipo, ['entrada', 'salida', 'retorno']) || $cantidad <= 0 || $id_material <= 0 || $descripcion_salida === '') {
        echo "datos-invalidos";
        exit;
    }

    // Valor por defecto si no hay observaciones
    if ($observaciones === '') {
        $observaciones = 'Sin observaciones';
    }

    // Verificar existencia del material y su stock actual
    $sql = "SELECT cantidad, planta FROM Materiales WHERE id_material = ?";
    $stmt = $cn->prepare($sql);
    $stmt->bind_param("i", $id_material);
    $stmt->execute();
    $stmt->bind_result($cantidad_disponible, $planta_material);

    if (!$stmt->fetch()) {
        echo "material-no-existe";
        exit;
    }
    $stmt->close();

    // Validar disponibilidad de stock en caso de salida
    if ($tipo === 'salida' && $cantidad > $cantidad_disponible) {
        echo "stock-insuficiente";
        exit;
    }

    // Iniciar transacción
    $cn->begin_transaction();

    try {
        // Insertar nuevo movimiento
        $sqlInsert = "INSERT INTO Movimientos (tipo, cantidad, descripcion_salida, observaciones, planta_movimiento, id_material, id_usuario)
                      VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmtInsert = $cn->prepare($sqlInsert);
        if (!$stmtInsert) {
            echo "error-preparar-insert: " . $cn->error;
            $cn->rollback();
            exit;
        }

        $stmtInsert->bind_param("sisssii", $tipo, $cantidad, $descripcion_salida, $observaciones, $planta_material, $id_material, $id_usuario);

        if (!$stmtInsert->execute()) {
            echo "error-insertar-movimiento: " . $stmtInsert->error;
            $cn->rollback();
            exit;
        }

        // Actualizar stock
        $sqlStock = ($tipo === 'salida')
            ? "UPDATE Materiales SET cantidad = cantidad - ? WHERE id_material = ?"
            : "UPDATE Materiales SET cantidad = cantidad + ? WHERE id_material = ?";

        $stmtStock = $cn->prepare($sqlStock);
        $stmtStock->bind_param("ii", $cantidad, $id_material);

        if (!$stmtStock->execute()) {
            $cn->rollback();
            echo "error-actualizar-stock";
            exit;
        }

        // Confirmar transacción
        $cn->commit();
        echo "ok";
    } catch (Exception $e) {
        // Revertir cambios en caso de error
        $cn->rollback();
        echo "error-transaccion";
    }

    exit;
}

// ========================== ACCIÓN NO RECONOCIDA ==========================
echo "accion-desconocida";
exit;
