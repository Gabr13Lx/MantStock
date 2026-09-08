function verificarSesion() {
    const ajax_seguridad = crearAjax();
    ajax_seguridad.open('GET', '../ConexionesPHP/Seguridad/validar_sesion_activa.php', true);
    ajax_seguridad.onreadystatechange = function () {
        if (ajax_seguridad.readyState === 4 && ajax_seguridad.status === 200) {
            try {
                const respuesta = JSON.parse(ajax_seguridad.responseText);

                switch (respuesta.estado) {
                    case "sin-sesion":
                        window.location.href = "../index.html";
                        break;
                    case "usuario-inactivo":
                        Swal.fire({
                            icon: 'warning',
                            title: 'Usuario Desactivado',
                            text: 'Fuiste desactivado del Inventario.',
                            confirmButtonText: 'Ir al login'
                        }).then(() => {
                            window.location.href = "../index.html";
                        });
                        break;
                    case "ok":
                        // Todo bien, no hacer nada
                        break;
                    default:
                        console.warn("Respuesta inesperada en verificación de sesión.");
                        break;
                }

            } catch (e) {
                console.error("Error procesando la verificación de sesión: ", e);
            }
        }
    };
    ajax_seguridad.send();
}
