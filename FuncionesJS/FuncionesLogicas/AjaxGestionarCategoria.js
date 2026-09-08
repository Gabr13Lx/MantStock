let nombreOriginal = "";

// Buscar coincidencias por nombre y mostrar en el <select>
function buscarCategoriaPorNombre() {
    verificarSesion(); // Seguridad activa

    const input = document.getElementById("nombre-busqueda-categoria");
    const texto = input.value.trim();
    const select = document.getElementById("coincidencias-categorias");

    if (texto.length < 2) {
        select.innerHTML = `<option selected disabled>Ingrese al menos 2 caracteres...</option>`;
        select.disabled = true;
        return;
    }

    const ajax = crearAjax();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            try {
                const resultados = JSON.parse(ajax.responseText);

                if (resultados.length > 0) {
                    select.disabled = false;
                    select.innerHTML = `<option selected disabled>Seleccione una categoría...</option>`;
                    resultados.forEach(cat => {
                        const option = document.createElement("option");
                        option.value = cat.id_categoria;
                        option.textContent = cat.nombre;
                        select.appendChild(option);
                    });
                } else {
                    select.innerHTML = `<option selected disabled>No hay coincidencias</option>`;
                    select.disabled = true;
                }
            } catch (error) {
                select.innerHTML = `<option selected disabled>Error al interpretar datos</option>`;
                select.disabled = true;
            }
        }
    };

    ajax.open("POST", "../ConexionesPHP/Funciones/buscar_categoria_nombre.php", true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.send("nombre=" + encodeURIComponent(texto));
}

// Cargar los datos completos de la categoría seleccionada
function cargarDatosCategoriaPorID(id) {
    if (!id || isNaN(id)) return;

    verificarSesion();

    const ajax = crearAjax();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            try {
                const categoria = JSON.parse(ajax.responseText);

                document.getElementById("nombre_categoria_editar").value = categoria.nombre;
                document.getElementById("descripcion_categoria_editar").value = categoria.descripcion || "";
                document.getElementById("seccionCategoria").classList.remove("d-none");
                document.getElementById("nombre_categoria_editar").addEventListener("keyup", capitalizarPrimeraLetra, false);
                document.getElementById("nombre_categoria_editar").addEventListener("keyup", bloquearEspacios, false);
                document.getElementById("descripcion_categoria_editar").addEventListener("keyup", bloquearEspacios, false);

            } catch (e) {
                Swal.fire("Error", "Datos inválidos recibidos del servidor", "error");
                limpiarCaposGestionarCategoria();
                document.getElementById("seccionCategoria").classList.add("d-none");
            }
        }
    };

    ajax.open("GET", "../ConexionesPHP/Funciones/obtener_categoria_por_id.php?id=" + encodeURIComponent(id), true);
    ajax.send();
}


function guardarCambiosCategoria(forzarCambioNombre = false, confirmacionClave = null) {
    verificarSesion();

    // Obtener ID desde el <select>
    const select = document.getElementById("coincidencias-categorias");
    const id = select && select.value ? select.value.trim() : "";

    // Obtener los valores ingresados
    const nombre = document.getElementById("nombre_categoria_editar").value.trim();
    const descripcion = document.getElementById("descripcion_categoria_editar").value.trim();

    if (!id || !nombre) {
        Swal.fire("Campos incompletos", "El nombre de la categoría es obligatorio.", "warning");
        return;
    }

    Swal.fire({
        title: "¿Guardar cambios?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const ajax = crearAjax();
            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4 && ajax.status === 200) {
                    const respuesta = ajax.responseText.trim();

                    if (respuesta === "ok") {
                        Swal.fire({
                            icon: "success",
                            title: "Cambios guardados correctamente",
                            toast: true,
                            position: "top-end",
                            timer: 2000,
                            showConfirmButton: false
                        });
                    } else if (respuesta === "requiere-validacion") {
                        Swal.fire({
                            icon: "info",
                            title: "Confirmación requerida",
                            html:
                                "El nombre de esta categoría ya está vinculado a materiales existentes.<br><br>" +
                                "Por seguridad, debe ingresar su contraseña para confirmar que desea aplicar los cambios.",
                            input: "password",
                            inputPlaceholder: "Ingrese su contraseña",
                            inputAttributes: {
                                autocapitalize: "off",
                                autocomplete: "off"
                            },
                            showCancelButton: true,
                            confirmButtonText: "Confirmar cambios",
                            cancelButtonText: "Cancelar",
                            preConfirm: (clave) => {
                                if (!clave || clave.trim().length < 4) {
                                    Swal.showValidationMessage("Debe ingresar su contraseña para continuar.");
                                    return false;
                                }
                                return clave.trim();
                            }
                        }).then((confirmResult) => {
                            if (confirmResult.isConfirmed && confirmResult.value) {
                                // Llamar recursivamente con la contraseña
                                guardarCambiosCategoria(true, confirmResult.value);
                            }
                        });

                    } else {
                        Swal.fire("Error", respuesta, "error").then(() => {
                            limpiarCaposGestionarCategoria();
                        });
                    }
                }
            };

            ajax.open("POST", "../ConexionesPHP/Funciones/actualizarCategoria.php", true);
            ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            let params = `id_categoria=${encodeURIComponent(id)}&nombre=${encodeURIComponent(nombre)}&descripcion=${encodeURIComponent(descripcion)}`;
            if (forzarCambioNombre && confirmacionClave) {
                params += `&confirmado=1&clave=${encodeURIComponent(confirmacionClave)}`;
            }

            ajax.send(params);
        }
    });
}
