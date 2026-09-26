<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

if (!$cn->connect_errno) {

    // === Obtener el ID más alto de la tabla Usuarios ===
    $busqueda = $cn->query("SELECT MAX(id_usuario) FROM Usuarios");

    // Validar si se obtuvo correctamente un resultado
    if ($busqueda->num_rows > 0 && $busqueda->num_rows < 2) {
        $id_usuario = $busqueda->fetch_array()
        echo $id_usuario[0]; // Devuelve el último ID de usuario
    } else {
        echo "Error-Busqueda"; // Falla en la consulta o resultados inconsistentes
    }

    $cn->close(); // Cerrar conexión

} else {
    echo "Fallo la Conexión: " . $cn->connect_error;
}
?>
