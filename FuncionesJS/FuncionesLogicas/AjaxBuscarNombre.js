function cargarNombreUsuario() {
    let ajaxNombre = crearAjax();
    ajaxNombre.onreadystatechange = function () {
        if (ajaxNombre.readyState === 4 && ajaxNombre.status === 200) {
            let inputNombre = document.getElementById("Buscar_nombre");
            if (inputNombre) {
                inputNombre.value = ajaxNombre.responseText.trim();
            }
        } else if (ajaxNombre.responseText === "Sin-sesion") {
            window.location.href = "../index.html";
        }
    };
    ajaxNombre.open("POST", "../ConexionesPHP/Funciones/buscarNombre.php", true);
    ajaxNombre.send();
}
