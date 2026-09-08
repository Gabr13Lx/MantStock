let con_buscarUsr, correo_buscar;
let id_usuario_mostrado = null; // Guardará el ID que se mostró tras una búsqueda válida

function ajaxBuscarUsuario() {
    verificarSesion();
    correo_buscar = document.getElementById("numeroUsuario").value.trim();

    if (correo_buscar) {
        con_buscarUsr = crearAjax();
        con_buscarUsr.onreadystatechange = esperaBuscarUsuario;
        con_buscarUsr.open("POST", "../ConexionesPHP/Funciones/buscarUsuario.php", true);
        con_buscarUsr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        con_buscarUsr.send("correo=" + encodeURIComponent(correo_buscar));
    } else {
        Swal.fire("info", "Falta Información", "Debes colocar el número de usuario a buscar");
    }
}

function esperaBuscarUsuario() {
    verificarSesion();
    if (con_buscarUsr.readyState === 4 && con_buscarUsr.status === 200) {
        const respuesta = con_buscarUsr.responseText.trim();

        if (respuesta === "No-encontrado") {
            Swal.fire("Usuario no encontrado", "", "warning");
            limpiarCamposUsuario();
            document.getElementById("numeroUsuario").value = "";
            id_usuario_mostrado = null;
            actualizarBotonEstado();
        } else {
            const datos = respuesta.split("|");

            if (datos.length === 6) {
                const [nombre, apellido, correo, rol, fecha, estado] = datos;

                document.getElementById("nombre").value = nombre;
                document.getElementById("apellido").value = apellido;
                document.getElementById("correo").value = correo;
                document.getElementById("rol").value = rol;
                document.getElementById("fecha").value = fecha;
                document.getElementById("estado").value = estado;

                id_usuario_mostrado = document.getElementById("numeroUsuario").value.trim(); // Guardamos el ID mostrado
                actualizarBotonEstado();
            } else {
                Swal.fire("Error en los datos recibidos", "No se recibieron todos los campos esperados.", "error");
                limpiarCamposUsuario();
                id_usuario_mostrado = null;
                actualizarBotonEstado();
            }
        }
    }
}

