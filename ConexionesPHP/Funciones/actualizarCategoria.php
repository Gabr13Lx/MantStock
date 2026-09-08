<?php
// Iniciar sesión y verificar si hay un usuario autenticado
session_start();
// Establecer conexión con la base de datos
require('../ConexionDB/conexion.php');

// === Sanitización y obtención de datos del formulario ===
$id_categoria = isset($_POST['id_categoria']) ? intval($_POST['id_categoria']) : 0;
$nombreNuevo = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
$descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : '';
$confirmado = isset($_POST['confirmado']) ? intval($_POST['confirmado']) : 0;
$confirm_id = isset($_POST['confirm_id']) ? intval($_POST['confirm_id']) : 0;
$clave = isset($_POST['clave']) ? trim($_POST['clave']) : '';

// Validar que al menos haya una categoría válida y un nombre
if ($id_categoria <= 0 || $nombreNuevo === '') {
    exit("Datos inválidos");
}

// === Obtener nombre actual de la categoría desde la base de datos ===
$stmt = $cn->prepare("SELECT nombre FROM Categorias WHERE id_categoria = ?");
$stmt->bind_param("i", $id_categoria);
$stmt->execute();
$stmt->bind_result($nombreOriginal);
if (!$stmt->fetch()) {
    $stmt->close();
    exit("no-encontrado"); // Categoría no encontrada
}
$stmt->close();

// === Si el nombre no ha cambiado, solo actualizamos la descripción ===
if ($nombreNuevo === $nombreOriginal) {
    $stmt = $cn->prepare("UPDATE Categorias SET descripcion = ? WHERE id_categoria = ?");
    $stmt->bind_param("si", $descripcion, $id_categoria);
    if ($stmt->execute()) {
        echo "ok"; // Descripción actualizada exitosamente
    } else {
        echo "Error al actualizar descripción";
    }
    $stmt->close();
    $cn->close();
    exit;
}

// === Verificar si hay materiales asociados a la categoría ===
$stmt = $cn->prepare("SELECT COUNT(*) FROM Materiales WHERE id_categoria = ?");
$stmt->bind_param("i", $id_categoria);
$stmt->execute();
$stmt->bind_result($totalItems);
$stmt->fetch();
$stmt->close();

// === Si hay materiales y no hay confirmación, se requiere validación adicional ===
if ($totalItems > 0 && $confirmado !== 1) {
    exit("requiere-validacion"); // Solicita confirmación extra por seguridad
}

// === Validación de seguridad si se envió confirmación con contraseña ===
if ($confirmado == 1) {
    if (empty($clave)) {
        exit("Debe ingresar su contraseña para confirmar el cambio.");
    }

    $id_usuario_sesion = $_SESSION['usuario'];

    // Obtener la contraseña del usuario actual (hash bcrypt)
    $stmt = $cn->prepare("SELECT contrasena FROM Usuarios WHERE id_usuario = ?");
    $stmt->bind_param("i", $id_usuario_sesion);
    $stmt->execute();
    $stmt->bind_result($hash);
    if (!$stmt->fetch()) {
        $stmt->close();
        exit("Usuario no encontrado");
    }
    $stmt->close();

    // Comparar la contraseña ingresada con la guardada usando password_verify (bcrypt)
    if (!password_verify($clave, $hash)) {
        exit("Contraseña incorrecta");
    }
}



// === Proceder a actualizar nombre y descripción de la categoría ===
$stmt = $cn->prepare("UPDATE Categorias SET nombre = ?, descripcion = ? WHERE id_categoria = ?");
$stmt->bind_param("ssi", $nombreNuevo, $descripcion, $id_categoria);
if ($stmt->execute()) {
    echo "ok"; // Actualización completa exitosa
} else {
    echo "Error al actualizar categoría";
}
$stmt->close();
$cn->close(); // Cerrar conexión a la BD
