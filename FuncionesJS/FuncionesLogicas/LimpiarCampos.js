function limpiarLogin() {
    document.getElementById("txt_contrasena").value = "";
}


function limpiarLoginCompleto() {
    document.getElementById("txt_correo").value = "";
    document.getElementById("txt_contrasena").value = "";
}

function limpiarCrearUsuario() {
    verificarSesion();
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("password").value = "";

}

function limpiarGestionarUsuario() {
    verificarSesion();

    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("rol").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("numeroUsuario").value = "";
    actualizarBotonEstado()

}

function limpiarRegistrarItem() {
    verificarSesion();
    document.getElementById("nombre").value = "";
    document.getElementById("numero_serie").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("tipo_gestion").selectedIndex = 0;
    document.getElementById("Ubicacion_almacen").selectedIndex = 0;
    document.getElementById("descripcion").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("id_categoria").selectedIndex = 0;
}

function limpiarCambiosItem() {
    verificarSesion();
    const form = document.getElementById('formGestionarItem');
    form.reset();
    // Limpiar imagen actual (puedes poner imagen por defecto o vaciar)
    const imgActual = document.getElementById('img_item_actual');
    imgActual.src = '';  // O ruta a imagen placeholder
    form.classList.add("d-none");

}

function limpiarCrearCategoria() {
    verificarSesion();
    document.getElementById("nombre_categoria").value = "";
    document.getElementById("descripcion_categoria").value = "";
}

function limpiarCaposGestionarCategoria() {
    verificarSesion();

    // Limpiar campos visibles del formulario
    document.getElementById("nombre_categoria_editar").value = "";
    document.getElementById("descripcion_categoria_editar").value = "";

    // Limpiar y ocultar formulario
    document.getElementById("seccionCategoria").classList.add("d-none");

    // Limpiar input de búsqueda por nombre
    const inputNombre = document.getElementById("nombre-busqueda-categoria");
    if (inputNombre) inputNombre.value = "";

    // Limpiar select de coincidencias
    const selectCoincidencias = document.getElementById("coincidencias-categorias");
    if (selectCoincidencias) {
        selectCoincidencias.innerHTML = `<option selected disabled>Ingrese al menos 2 caracteres...</option>`;
        selectCoincidencias.disabled = true;
    }

    // Reiniciar variable global si la usas
    if (typeof nombreOriginal !== "undefined") {
        nombreOriginal = "";
    }
}


// Limpiar campos y resetear estado
function limpiarCamposActualizarContrasena() {
    verificarSesion();
    const nuevaPass = document.getElementById('nueva_contraseña');
    const repetirPass = document.getElementById('repetir_contraseña');
    const btnActualizar = document.getElementById('btn_actualizar_contraseña');


    nuevaPass.value = '';
    repetirPass.value = '';
    btnActualizar.disabled = true;
    estructuraMostrada = false;
}



function limpiarCamposUsuario() {
    verificarSesion();
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("rol").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("numeroUsuario").value = "";
    actualizarBotonEstado()
}


function limpiar_gestion_materiales() {
    verificarSesion();
    const form = document.getElementById('formGestionarItem');
    form.reset();
    const selectCoincidencias = document.getElementById('coincidencias-materiales');
    if (selectCoincidencias) {
        // Vaciar todas las opciones actuales
        selectCoincidencias.innerHTML = '';

        // Crear opción por defecto deshabilitada y seleccionada
        const opcionDefault = document.createElement('option');
        opcionDefault.textContent = 'Escriba al menos 2 caracteres...';
        opcionDefault.disabled = true;
        opcionDefault.selected = true;

        // Agregar la opción al select
        selectCoincidencias.appendChild(opcionDefault);
    }


    // Vaciar input específico (por si reset no lo limpia bien)
    const inputNombre = document.getElementById('material-a-modificar');
    if (inputNombre) {
        inputNombre.value = "";
    }
    document.getElementById("Ubicacion_almacen_busqueda").value = "Todos";

    const imgActual = document.getElementById('img_item_actual');
    imgActual.src = '';  // O la ruta a la imagen por defecto

    form.classList.add("d-none");
}
