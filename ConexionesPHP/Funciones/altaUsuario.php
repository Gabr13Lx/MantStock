<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// === Recibir datos del formulario ===
$primer_nombre = $_POST['nombre'];
$primer_apellido = $_POST['apellido'];
$correo = $_POST['correo'];
$contrasena = $_POST['contrasena'];

// Validar que los campos obligatorios estén completos
if (!$primer_nombre || !$primer_apellido || !$correo || !$contrasena) {
    exit("Faltan datos obligatorios");
}

// === Encriptar la contraseña con algoritmo seguro (bcrypt por defecto) ===
$hash_seguro = password_hash($contrasena, PASSWORD_DEFAULT);

// === Insertar nuevo usuario con rol 'usuario' ===
$insercion = $cn->query("
    INSERT INTO Usuarios (primer_nombre, primer_apellido, correo, contrasena, rol)
    VALUES ('$primer_nombre', '$primer_apellido', '$correo', '$hash_seguro', 'Usuario')
");

// === Verificar si la inserción fue exitosa ===
if ($insercion) {
    // Buscar el ID del usuario recién insertado
    $resultado = $cn->query("
        SELECT id_usuario FROM Usuarios
        WHERE correo = '$correo'
        ORDER BY id_usuario DESC LIMIT 1
    ");

    if ($resultado && $fila = $resultado->fetch_array()) {
        echo "Registrado"; // Registro exitoso
    } else {
        echo "Error al verificar el registro";
    }
} else {
    echo "Error en la inserción: " . $cn->error;
}

$cn->close(); // Cierre de conexión
?>
