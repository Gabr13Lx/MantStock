document.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    const inputBuscar = document.getElementById("inputBuscarMaterial");
    const selectMateriales = document.getElementById("select_materiales");

    // Buscar mientras escribe (evento correcto)
    inputBuscar.addEventListener("input", function () {
        const termino = inputBuscar.value.trim();

        if (termino.length < 2) {
            selectMateriales.innerHTML = '<option value="">-- Escribe al menos 2 letras --</option>';
            return;
        }

        const ajax = crearAjax();
        const formData = new FormData();
        formData.append("termino", termino);

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                selectMateriales.innerHTML = ajax.responseText;
            }
        };

        ajax.open("POST", "../ConexionesPHP/Funciones/buscarMaterialPorNombre.php", true);
        ajax.send(formData);
    });

    // Mostrar información al seleccionar material
    selectMateriales.addEventListener("change", function () {
        verificarSesion();
        const idMaterial = this.value;
        if (!idMaterial) return;

        const ajax = crearAjax();
        const formData = new FormData();
        formData.append("id_item", idMaterial);

        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                try {
                    const data = JSON.parse(ajax.responseText);

                    const formulario = document.getElementById("formGestionarItem");
                    formulario.classList.remove("d-none");

                    document.getElementById("nombre").value = data.nombre;
                    document.getElementById("numero_serie").value = data.numero_serie || "";
                    document.getElementById("cantidad").value = data.cantidad;
                    document.getElementById("precio").value = data.precio;
                    document.getElementById("ubicacion").value = data.ubicacion || "";
                    document.getElementById("descripcion").value = data.descripcion || "";
                    document.getElementById("tipo_gestion").value = data.tipo_gestion;
                    document.getElementById("id_categoria").value = data.id_categoria;

                    const imgActual = document.getElementById("img_item_actual");
                    imgActual.src = `../uploads/productos/${data.imagen}`;
                    imgActual.alt = data.nombre;

                    asignarEventosItem();
                } catch (error) {
                    console.error("Error al procesar el JSON:", error);
                    Swal.fire("Error", "No se pudo cargar la información del material", "error");
                }
            }
        };

        ajax.open("POST", "../ConexionesPHP/Funciones/buscarItemPorID.php", true);
        ajax.send(formData);
    });
});
