function cargarCategoriasBusqueda() {
    verificarSesion();
    const selectCat = document.getElementById("id_categoria");

    // AJAX clásico
    const ajax = crearAjax();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            const respuesta = ajax.responseText.trim();
            selectCat.innerHTML = ""; // limpiar opciones previas

            if (!respuesta || respuesta.startsWith("sin_categorias") || respuesta.startsWith("error")) {
                Swal.fire({
                    icon: "info",
                    title: "Debes Crear CATEGORIAS Primero para dar de alta algún material",
                    toast: true,
                    position: "top-end",
                    timer: 200000,
                    showConfirmButton: false
                });
                return;
            }

            const filas = respuesta.split("\n");
            const fragment = document.createDocumentFragment();

            // Opción por defecto
            const opcionDefault = document.createElement("option");
            opcionDefault.value = "Todos";
            opcionDefault.textContent = "Todas";
            opcionDefault.selected = true;
            opcionDefault.disabled = false;
            fragment.appendChild(opcionDefault);

            filas.forEach(fila => {
                const partes = fila.split(",");
                let id = "";
                let nombre = "";

                partes.forEach(parte => {
                    const [clave, valor] = parte.split(":");
                    if (clave === "id_categoria") id = valor;
                    else if (clave === "nombre") nombre = valor;
                });

                if (id && nombre) {
                    const opcion = document.createElement("option");
                    opcion.value = id;
                    opcion.textContent = nombre;
                    fragment.appendChild(opcion);
                }
            });

            selectCat.appendChild(fragment);
            selectCat.disabled = false;
        }
    };

    ajax.open("GET", "../ConexionesPHP/Funciones/fragment_cargarCategorias_busqueda.php", true);
    ajax.send();
}
