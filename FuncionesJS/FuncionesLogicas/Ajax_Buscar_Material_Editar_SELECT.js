document.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    const selectCoincidencias = document.getElementById("coincidencias-materiales");
    const form = document.getElementById("formGestionarItem");

    selectCoincidencias.addEventListener("change", () => {
        const idSeleccionado = selectCoincidencias.value;

        if (!idSeleccionado) return;

        const ajax = crearAjax();
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                try {
                    const respuesta = ajax.responseText.trim();

                    if (respuesta === "no-encontrado") {
                        Swal.fire({
                            icon: "warning",
                            title: "No encontrado",
                            text: "No se encontró ningún ítem con ese nombre.",
                        });
                        return;
                    }

                    if (respuesta === "Sin-sesion") {
                        Swal.fire({
                            icon: "error",
                            title: "Sesión caducada",
                            text: "Por favor, vuelve a iniciar sesión.",
                        });
                        return;
                    }

                    const material = JSON.parse(respuesta);

                    // Rellenar el formulario con los datos recibidos
                    document.getElementById("nombre").value = material.nombre || "";
                    document.getElementById("numero_serie").value = material.numero_serie || "";
                    document.getElementById("precio").value = material.precio || "";
                    document.getElementById("cantidad").value = material.cantidad || "";
                    document.getElementById("ubicacion").value = material.ubicacion || "";
                    document.getElementById("descripcion").value = material.descripcion || "";
                    document.getElementById("tipo_gestion").value = material.tipo_gestion || "";
                    document.getElementById("Ubicacion_almacen").value = material.planta || "";
                    document.getElementById("id_categoria").value = material.id_categoria || "";

                    const img = document.getElementById("img_item_actual");
                    img.src = material.imagen ? `../uploads/productos/${material.imagen}` : "";
                    img.alt = material.nombre || "Imagen del ítem";

                    // Mostrar el formulario
                    form.classList.remove("d-none");
                    asignarEventosItem();
                } catch (e) {
                    console.error("Error al interpretar JSON:", e);
                    Swal.fire({
                        icon: "error",
                        title: "Error de datos",
                        text: "Hubo un problema al cargar los datos del material.",
                    });
                }
            }
        };

        ajax.open("POST", "../ConexionesPHP/Funciones/busqueda_Material_Nombre.php", true);
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.send("id_item=" + encodeURIComponent(idSeleccionado));
    });
});
