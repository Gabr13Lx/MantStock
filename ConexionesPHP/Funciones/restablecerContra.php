<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
$correo_res = $_POST['correo'] ?? '';

if (!$cn->connect_errno && !empty($correo_res)) {
    $correo_res = $cn->real_escape_string($correo_res);

    $sql = "SELECT id_usuario, primer_nombre, primer_apellido FROM Usuarios WHERE correo = '$correo_res'";
    $resultado = $cn->query($sql);

    if ($resultado && $resultado->num_rows === 1) {
        $datos = $resultado->fetch_assoc();

        $id_usuario = $datos['id_usuario'];
        $nombre = $datos['primer_nombre'];
        $apellido = $datos['primer_apellido'];

        // Concatenar id + nombre + apellido en texto plano
        $contrasena_plana = $id_usuario . $nombre . $apellido;

        // Hashear la contraseña con bcrypt usando password_hash()
        $contrasena_hash = password_hash($contrasena_plana, PASSWORD_BCRYPT);

        // Actualizar la contraseña con la versión hasheada
        $update = "UPDATE Usuarios SET contrasena = '$contrasena_hash' WHERE id_usuario = '$id_usuario'";

        if ($cn->query($update)) {
            echo "ok";
        } else {
            echo "error";
        }
    } else {
        echo "error";
    }

    $cn->close();

} else {
    echo "error";
}
?>
