function enviarFiltros(e) {
    verificarSesion();

    // Prevenir envío por defecto
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;

    const form = document.getElementById("formFiltros");
    const formData = new FormData(form);

    // Mensaje temporal mientras carga
    document.getElementById("tabla_historial").innerHTML = `
        <tr><td colspan="8" class="text-muted">Cargando resultados...</td></tr>`;

    const xhr = crearAjax();
    xhr.open("POST", "../ConexionesPHP/Funciones/mis_Movimientos_Ajax.php", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            document.getElementById("tabla_historial").innerHTML = xhr.responseText;
        } else {
            console.error("Error al procesar la respuesta del servidor.");
        }
    };

    xhr.onerror = function () {
        console.error("Error de conexión con el servidor.");
    };

    xhr.send(formData);
}
