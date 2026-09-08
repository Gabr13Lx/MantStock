<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');
// Obtener datos del formulario
$correo = $_POST['correo'];
$contrasena = $_POST['contrasena'];

if (!$cn->connect_errno) {

    // === Buscar usuario por correo ===
    $stmt = $cn->prepare("SELECT id_usuario, rol, estado, contrasena FROM Usuarios WHERE correo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    // === Validar si se encontró exactamente un usuario ===
    if ($resultado->num_rows === 1) {
        $usuario = $resultado->fetch_array();
        // === Verificar la contraseña hasheada ===
        if (password_verify($contrasena, $usuario['contrasena'])) {

            // === Verificar el rol y estado del usuario ===
            if ($usuario['estado'] === 'Activo') {
                $_SESSION['usuario'] = $usuario['id_usuario'];
                echo ($usuario['rol'] === 'Administrador') ? "administrador" : "usuario";
            } else {
                echo "sin-acceso"; // Usuario inactivo
            }

        } else {
            echo "sin-contraseña"; // Contraseña incorrecta
        }
    } else {
        echo "ERROR"; // Usuario no encontrado o múltiples resultados (anómalo)
    }

    $stmt->close();
    $cn->close();

} else {
    echo "Fallo la Conexión";
}
?>
