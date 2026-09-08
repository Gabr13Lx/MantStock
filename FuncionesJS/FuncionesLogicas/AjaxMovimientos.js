function enviarFiltros(e) {
    
    verificarSesion();
    // Prevenir recarga de página por envío de formulario
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;

    // Obtener el formulario y los datos
    const form = document.getElementById("formFiltros");
    const formData = new FormData(form);

    // Verificar qué se está enviando
    for (let [key, value] of formData.entries()) {
        console.log(key + ": " + value);
    }

    // Crear solicitud AJAX
    const xhr = crearAjax();
    xhr.open("POST", "../ConexionesPHP/Funciones/movimientos_ajax.php", true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            // Insertar respuesta en la tabla
            document.getElementById('tabla_historial').innerHTML = xhr.responseText;
        } else {
            console.error("Error al cargar los datos del historial.");
        }
    };

    xhr.onerror = function () {
        console.error("Error de conexión con el servidor.");
    };

    xhr.send(formData);
}
