let carg_conexion_registrarItem;

function ajaxRegistrarItem() {
    verificarSesion();
    const nombre = document.getElementById("nombre").value.trim(); //*****NOMBRE (OBLIGATORIO)
    const numero_serie = document.getElementById("numero_serie").value.trim(); // NUMERO DE SERIE (OPCIONAL)
    const cantidad = parseInt(document.getElementById("cantidad").value.trim()); //*****CANTIDAD DE STOCK (OBLIGATORIO)
    const precio = parseInt(document.getElementById("precio").value.trim()); // PRECIO (OPCIONAL)
    const ubicacion = document.getElementById("ubicacion").value.trim(); // *****UBICACIÓON FISICA DENTRO DEL ALMACEN (OBLIGATORIO)
    const tipo_gestion = document.getElementById("tipo_gestion").value; // *****FORMA EN LA QUE SE CONSUME (OBLIGATORIO)
    const planta = document.getElementById("Ubicacion_almacen").value; // *****PLANTA DONDE ESTA EL ALMANCEN FISICO (OBLOGATORIO)
    const id_categoria = parseInt(document.getElementById("id_categoria").value); // *****FAMILIA O GRUPO AL QUE PERTENECE EL MATERIAL (OBLIGATORIO)
    const descripcion = document.getElementById("descripcion").value.trim(); // *****DETALLES DEL MATERIAL (OBLIGATORIO)
    const imagen = document.getElementById("imagen").files[0]; // IMAGEN DEL MATERIAL (OPCIONAL)

    //Validamos que los campos obligatorios contengan información
    if (!nombre || !cantidad || !tipo_gestion || !id_categoria || !descripcion || !planta) {
        Swal.fire("Error", "Debes llenar todos los campos obligatorios", "error");
        return;
    }

    if (!ubicacion) {
        Swal.fire({
            title: "¿Registrar sin ubicación?",
            text: "¿Estás seguro de registrar el ítem sin una ubicación definida?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
        }).then((r1) => {
            if (r1.isConfirmed) {
                validarImagenYConfirmar(nombre, numero_serie, cantidad, "", precio, tipo_gestion, id_categoria, planta, descripcion, imagen);
            }
        });
        return;
    }

    if (!precio) {
        Swal.fire({
            title: "¿Registrar sin precio?",
            text: "¿Estás seguro de registrar el ítem sin un precio definido?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "Cancelar"
        }).then((r2) => {
            if (r2.isConfirmed) {
                validarImagenYConfirmar(nombre, numero_serie, cantidad, ubicacion, "", tipo_gestion, id_categoria, planta, descripcion, imagen);
            }
        });
        return;
    }

    validarImagenYConfirmar(nombre, numero_serie, cantidad, ubicacion, precio, tipo_gestion, id_categoria, planta, descripcion, imagen);

    function validarImagenYConfirmar(nombre, numero_serie, cantidad, ubicacionFinal, precioFinal, tipo_gestion, id_categoria, planta_almacen, descripcion, imagen) {
        if (!imagen) {
            Swal.fire({
                title: "¿Registrar sin imagen?",
                text: "No has seleccionado ninguna imagen. ¿Deseas continuar sin imagen?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, continuar",
                cancelButtonText: "Cancelar"
            }).then((r3) => {
                if (r3.isConfirmed) {
                    confirmarRegistro(nombre, numero_serie, cantidad, ubicacionFinal, precioFinal, tipo_gestion, planta_almacen, id_categoria, descripcion, imagen);
                }
            });
        } else {
            confirmarRegistro(nombre, numero_serie, cantidad, ubicacionFinal, precioFinal, tipo_gestion, planta_almacen, id_categoria, descripcion, imagen);
        }
    }

    function confirmarRegistro(nombre, numero_serie, cantidad, ubicacionFinal, precioFinal, tipo_gestion, id_categoria, planta_almacen, descripcion, imagen) {
        Swal.fire({
            title: "¿Deseas guardar este ítem?",
            text: "Se registrará con la información proporcionada. ¿Confirmas el registro?",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Sí, guardar",
            cancelButtonText: "Revisar datos"
        }).then((r4) => {
            if (r4.isConfirmed) {
                enviarFormulario(nombre, numero_serie, cantidad, ubicacionFinal, precioFinal, tipo_gestion, planta_almacen, id_categoria, descripcion, imagen);
            }
        });
    }
}

function enviarFormulario(nombre, numero_serie, cantidad, ubicacion, precio, tipo_gestion, id_categoria, planta_almacen, descripcion, imagen) {
    verificarSesion();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("numero_serie", numero_serie);
    formData.append("cantidad", cantidad);
    formData.append("ubicacion", ubicacion);
    formData.append("precio", precio);
    formData.append("tipo_gestion", tipo_gestion);
    formData.append("id_categoria", id_categoria);
    formData.append("planta_almacen", planta_almacen);
    formData.append("descripcion", descripcion);
    if (imagen) {
        formData.append("imagen", imagen);
    }
    carg_conexion_registrarItem = crearAjax();
    carg_conexion_registrarItem.onreadystatechange = esperaRegistrarItem;
    carg_conexion_registrarItem.open("POST", "../ConexionesPHP/Funciones/registrarItem.php", true);
    carg_conexion_registrarItem.send(formData);
}

function esperaRegistrarItem() {
    if (carg_conexion_registrarItem.readyState === 4) {
        const respuesta = carg_conexion_registrarItem.responseText.trim();

        if (respuesta === "ok") {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Ítem registrado correctamente",
                showConfirmButton: false,
                timer: 1500
            });
            document.getElementById("formRegistroItem").reset();
        } else {
            // Filtrado de errores específicos
            switch (respuesta) {
                case "faltan-datos-obligatorios":
                    Swal.fire("Error", "Faltan datos obligatorios para el registro", "error");
                    break;

                case "nombre-ya-registrado":
                    Swal.fire("Nombre duplicado", "Ya existe un ítem con ese nombre en esta PLANTA. Usa uno diferente.", "warning");
                    break;

                case "numero_serie-ya-registrado":
                    Swal.fire("Número de serie duplicado", "Este número de serie ya está registrado en esta Planta. Verifica el dato.", "warning");
                    break;

                case "dato-duplicado":
                    Swal.fire("Dato duplicado", "Ya existe un registro con los mismos datos. Revisa la información.", "warning");
                    break;

                case "formato-no-permitido":
                    Swal.fire("Formato inválido", "Solo se permiten imágenes JPEG, PNG o WebP.", "error");
                    break;

                case "error-al-subir-imagen":
                    Swal.fire("Error al subir imagen", "Ocurrió un problema al guardar la imagen del ítem.", "error");
                    break;

                case "error-al-insertar":
                    Swal.fire("Error al insertar", "No se pudo registrar el ítem en la base de datos.", "error");
                    break;

                case "error-preparar-consulta":
                    Swal.fire("Error interno", "Ocurrió un problema al preparar la consulta.", "error");
                    break;

                case "error-preparar-update":
                    Swal.fire("Error interno", "No se pudo preparar la actualización de la imagen.", "error");
                    break;

                default:
                    Swal.fire("Error desconocido", respuesta || "Ocurrió un problema inesperado.", "error");
                    break;
            }
        }
    }
}
