function manejarCambioEstadoUsuario() {
    verificarSesion();
    const correo_usr = document.getElementById("numeroUsuario").value.trim();
    const estadoActual = document.getElementById("estado").value.trim();
    const rolUsuario = document.getElementById("rol").value.trim();

    // Seguridad: validar que el ID no fue manipulado
    if (!id_usuario_mostrado || correo_usr !== id_usuario_mostrado) {
        limpiarCamposUsuario();
        actualizarBotonEstado();
        Swal.fire("Intento inválido", "El ID del usuario fue modificado manualmente.", "error");
        return;
    }

    // Seguridad: no permitir inactivar administradores
    if (estadoActual === "Activo" && rolUsuario === "Administrador") {
        Swal.fire("Acción no permitida", "No puedes desactivar un usuario administrador.", "warning");
        return;
    }

    if (!correo_usr || (estadoActual !== "Activo" && estadoActual !== "Inactivo")) {
        Swal.fire("Error", "Debe buscar primero un usuario válido con estado válido.", "error");
        return;
    }

    const nuevoEstado = (estadoActual === "Activo") ? "Inactivo" : "Activo";
    const accion = (nuevoEstado === "Activo") ? "Activar" : "Desactivar";

    Swal.fire({
        title: `¿Deseas ${accion} al usuario?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Sí, ${accion}`,
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            cambiarEstadoEnServidor(correo_usr, nuevoEstado);
        }
    });
}

function cambiarEstadoEnServidor(id, nuevoEstado) {
    verificarSesion();
    const ajax = crearAjax();

    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            const respuesta = ajax.responseText.trim();

            if (respuesta === "ok") {
                document.getElementById("estado").value = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1);
                actualizarBotonEstado();

                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Estado actualizado exitosamente",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire("Error", "No se pudo actualizar el estado", "error");
            }
        }
    };

    ajax.open("POST", "../ConexionesPHP/Funciones/cambiarEstadoUsr.php", true);
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    ajax.send("correo=" + encodeURIComponent(id) + "&nuevo_estado=" + encodeURIComponent(nuevoEstado));
}

function actualizarBotonEstado() {
    verificarSesion();
    const estado = document.getElementById("estado").value.trim();
    const boton = document.getElementById("btn_estado");

    boton.classList.remove("btn-danger", "btn-success", "btn-secondary");

    if (estado === "Activo") {
        boton.disabled = false;
        boton.value = "Desactivar Usuario";
        boton.classList.add("btn", "btn-danger", "w-100");
    } else if (estado === "Inactivo") {
        boton.disabled = false;
        boton.value = "Activar Usuario";
        boton.classList.add("btn", "btn-success", "w-100");
    } else {
        boton.disabled = true;
        boton.value = "Estado del Usuario";
        boton.classList.add("btn", "btn-secondary", "w-100");
    }
}
