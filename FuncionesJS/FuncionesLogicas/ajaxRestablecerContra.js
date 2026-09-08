let con_restablecer, correo_rest;

function ajaxRestablecerContrasena() {
    verificarSesion();
    correo_rest = document.getElementById("numeroUsuario").value.trim();

    // Validación de seguridad: impedir manipulación del ID
    if (!id_usuario_mostrado || correo_rest !== id_usuario_mostrado) {
        limpiarCamposUsuario();
        Swal.fire("Acción inválida", "El número de usuario fue modificado manualmente", "error");
        return;
    }

    Swal.fire({
        title: "¿Restablecer contraseña?",
        text: "Se establecerá la contraseña por defecto para este usuario.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, restablecer",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            con_restablecer = crearAjax();
            con_restablecer.onreadystatechange = esperaRestablecerContrasena;
            con_restablecer.open("POST", "../ConexionesPHP/Funciones/restablecerContra.php", true);
            con_restablecer.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            con_restablecer.send("correo=" + encodeURIComponent(correo_rest));
        }
    });
}

function esperaRestablecerContrasena() {
    verificarSesion();
    if (con_restablecer.readyState === 4 && con_restablecer.status === 200) {
        const respuesta = con_restablecer.responseText.trim();

        if (respuesta === "error") {
            Swal.fire("Error", "No se pudo restablecer la contraseña", "error");
        } else {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Contraseña restablecida exitosamente",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }
}
