<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
if (!$cn->connect_errno) {

    // Consulta para obtener todas las categorías ordenadas alfabéticamente
    $resultado = $cn->query("SELECT id_categoria, nombre FROM Categorias ORDER BY nombre ASC");

    if ($resultado && $resultado->num_rows > 0) {
        $lineas = [];

        // Construir array con cada categoría en formato clave:valor
        while ($fila = $resultado->fetch_assoc()) {
            $lineas[] = "id_categoria:{$fila['id_categoria']},nombre:{$fila['nombre']}";
        }

        // Enviar respuesta separando filas por salto de línea
        echo implode("\n", $lineas);

    } else {
        echo "sin_categorias"; // No hay resultados
    }

    $cn->close();

} else {
    echo "error"; // Error en conexión
}
?>
