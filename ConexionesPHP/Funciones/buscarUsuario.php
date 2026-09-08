<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// Obtener el ID de usuario recibido por POST
$usr_buscar = $_POST['correo'] ?? '';

if (!$cn->connect_errno) {

    // Escapar la entrada para evitar inyecciones SQL (aunque mencionas que controlas formularios)
    $usr_buscar = $cn->real_escape_string($usr_buscar);

    // Consulta para obtener datos del usuario por ID
    $sql = "SELECT primer_nombre, primer_apellido, correo, rol, fecha_creacion, estado 
            FROM Usuarios WHERE correo = '$usr_buscar'";

    $resultado = $cn->query($sql);

    if ($resultado && $resultado->num_rows === 1) {
        $fila = $resultado->fetch_assoc();

        // Concatenar valores separados por '|'
        $respuesta = "";
        foreach ($fila as $valor) {
            $respuesta .= $valor . "|";
        }

        // Eliminar último separador '|'
        $respuesta = rtrim($respuesta, "|");

        echo $respuesta; // Respuesta con datos separados
    } else {
        echo "No-encontrado"; // Usuario no encontrado
    }

    $cn->close();

} else {
    echo "Fallo la conexión: " . $cn->connect_error; // Error en conexión BD
}
?>
