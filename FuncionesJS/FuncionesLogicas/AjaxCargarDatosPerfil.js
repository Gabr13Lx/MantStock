
// Cargar datos del perfil y reflejarlos en la UI
function cargarDatosPerfil() {
    verificarSesion();
    const nuevaPass = document.getElementById('nueva_contraseña');
    const repetirPass = document.getElementById('repetir_contraseña');
    const btnActualizar = document.getElementById('btn_actualizar_contraseña');

    const ajax = crearAjax();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            const respuesta = ajax.responseText.trim();

            if (respuesta.startsWith("error")) {
                Swal.fire("Error", "No se pudo cargar el perfil", "error");
                return;
            }

            const partes = respuesta.split("|");
            if (partes.length >= 5) {
                document.getElementById("perfil_id").value = partes[0];
                document.getElementById("perfil_nombre").value = partes[1];
                document.getElementById("perfil_apellido").value = partes[2];
                document.getElementById("perfil_correo").value = partes[3];
                document.getElementById("perfil_rol").value = partes[4];
            } else if (ajax.responseText === "Sin-sesion") {
                window.location.href = "../index.html";
            }
        }
    };

    ajax.open("POST", "../ConexionesPHP/Funciones/obtenerDatosPerfil.php", true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.send();
}
