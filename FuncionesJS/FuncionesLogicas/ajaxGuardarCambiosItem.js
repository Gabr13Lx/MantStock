function validarImagen(inputFile) {
    verificarSesion();
    if (inputFile.files.length === 0) return true; // No hay imagen, ok

    const archivo = inputFile.files[0];
    const tiposValidos = ["image/jpeg", "image/png", "image/gif"];
    if (!tiposValidos.includes(archivo.type)) {
        Swal.fire("Error", "Tipo de imagen no válido. Solo JPG, PNG o GIF permitidos.", "error");
        return false;
    }

    const maxSizeMB = 2; // Máximo 2 MB
    if (archivo.size > maxSizeMB * 1024 * 1024) {
        Swal.fire("Error", `La imagen debe pesar menos de ${maxSizeMB} MB.`, "error");
        return false;
    }

    return true;
}

function guardarCambiosItem() {
    verificarSesion();
    const ID_item_seleccionado = document.getElementById("coincidencias-materiales");
    const idItem = ID_item_seleccionado.value;
    console.log(idItem);
    if (!idItem) {
        Swal.fire("Error", "Primero debes buscar un ítem para editar.", "error");
        return;
    }

    const inputImagen = document.getElementById("nueva_imagen");
    if (!validarImagen(inputImagen)) {
        return; // Detener si la imagen no es válida
    }

    Swal.fire({
        title: "¿Guardar cambios?",
        text: "Esta acción actualizará la información del ítem.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            guardarCambiosItemEnServidor(idItem);
        }
    });
}

async function guardarCambiosItemEnServidor(idItem) {
    verificarSesion();
    // Acceso a los campos de Material ubicados en HTML 
    const nombre = document.getElementById("nombre").value.trim();
    const numero_serie = document.getElementById("numero_serie").value.trim();
    const cantidad = document.getElementById("cantidad").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const tipo_gestion = document.getElementById("tipo_gestion").value;
    const planta = document.getElementById("Ubicacion_almacen").value;
    const id_categoria = document.getElementById("id_categoria").value;
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre || !cantidad || !tipo_gestion || !id_categoria || !descripcion) {
        Swal.fire("Error", "Debes llenar todos los campos obligatorios", "error");
        return;
    }

    if (isNaN(cantidad) || parseInt(cantidad) < 0) {
        Swal.fire("Cantidad inválida", "Debe ser un número entero positivo", "warning");
        return;
    }

    if (precio && (isNaN(precio) || parseFloat(precio) < 0)) {
        Swal.fire("Precio inválido", "Debe ser un número válido", "warning");
        return;
    }

    if (isNaN(cantidad) || parseInt(cantidad) < 0) {
        Swal.fire("Cantidad inválida", "Debe ser un número entero positivo", "warning");
        return;
    }

    if (precio && (isNaN(precio) || parseFloat(precio) < 0)) {
        Swal.fire("Precio inválido", "Debe ser un número válido", "warning");
        return;
    } else if (parseFloat(precio) == 0) {
        const confirmacion = await Swal.fire({
            title: "¿Precio 0?",
            text: "¿Deseas dejar el precio en 0?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "No, volver"
        });
        if (!confirmacion.isConfirmed) return;
    }

    if (!numero_serie) {
        const confirmacion = await Swal.fire({
            title: "¿Número de serie vacío?",
            text: "No has ingresado ningún número de serie. ¿Deseas dejarlo vacío?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "No, volver"
        });
        if (!confirmacion.isConfirmed) return;
    }

    if (!ubicacion) {
        const confirmacion = await Swal.fire({
            title: "¿Ubicación vacía?",
            text: "No has ingresado ninguna ubicación. ¿Deseas dejarla vacía?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "No, volver"
        });
        if (!confirmacion.isConfirmed) return;
    }


    const ajax = crearAjax();
    const formData = new FormData();

    formData.append("id_item", idItem);
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("numero_serie", numero_serie);
    formData.append("cantidad", cantidad);
    formData.append("ubicacion", ubicacion);
    formData.append("id_categoria", id_categoria);
    formData.append("Ubicacion_almacen", planta);
    formData.append("tipo_gestion", tipo_gestion);
    formData.append("precio", precio);

    const inputImagen = document.getElementById("nueva_imagen");
    if (inputImagen.files.length > 0) {
        formData.append("imagen", inputImagen.files[0]);
    }

    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            if (ajax.status === 200) {
                const res = ajax.responseText.trim();
                switch (res) {
                    case "exito":
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Cambios guardados correctamente",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        limpiar_gestion_materiales(); 
                        break;
                    case "sesion-invalida":
                        Swal.fire("Sesión inválida", "Vuelve a iniciar sesión.", "warning");
                        break;
                    case "conexion-fallida":
                        Swal.fire("Error de conexión", "No se pudo conectar al servidor.", "error");
                        break;
                    case "no-encontrado":
                        Swal.fire("Ítem no encontrado", "El ID ingresado no existe.", "warning");
                        break;
                    case "sin-cambios":
                        Swal.fire("Sin cambios", "No se detectaron modificaciones.", "info");
                        break;
                    case "nombre-repetido":
                        Swal.fire("Nombre duplicado", "Ya existe otro ítem registrado con ese nombre.", "warning");
                        break;
                    case "numero-serie-repetido":
                        Swal.fire("Número de serie duplicado", "Este número de serie ya está registrado en otro ítem.", "warning");
                        break;
                    case "material-ya-existen-en-planta":
                        Swal.fire("Material duplicado en planta", "Ya existe un material con ese nombre o número de serie en la planta seleccionada.", "warning");
                        break;
                    case "error-subir-imagen":
                        Swal.fire("Error", "No se pudo subir la imagen.", "error");
                        break;
                    case "tipo-imagen-no-valido":
                        Swal.fire("Error", "Tipo de imagen no válido en el servidor.", "error");
                        break;
                    case "error-sql":
                    case "error-actualizar":
                        Swal.fire("Error", "Ocurrió un problema al actualizar.", "error");
                        break;
                    default:
                        Swal.fire("Error", res, "error");
                        break;
                }
            } else {
                Swal.fire("Error", "Error en la comunicación con el servidor.", "error");
            }
        }
    };


    ajax.open("POST", "../ConexionesPHP/Funciones/guardarCambiosItem.php", true);
    ajax.send(formData);
}