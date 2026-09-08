// Asigna 'cargar' al evento 'load' con soporte para navegadores antiguos
add(window, 'load', cargar, false);
// Agrega eventos de forma compatible (IE antiguo y modernos)
function add(ele, eve, fun, cap) {
    if (window.attachEvent) {
        ele.attachEvent('on' + eve, fun);
    } else {
        ele.addEventListener(eve, fun, cap);
    }
}

let carg_conexion_cerrarSesion;

function cargar() {
    verificarSesion();
    cargarNombreUsuario();
    document.getElementById("btnCerrarSesion").addEventListener("click", AjaxCerrarSesion, false);
    cargarCategorias();
    document.getElementById("material-a-modificar").addEventListener("keyup", capitalizarPrimeraLetra, false);
}


function asignarEventosItem() {
    verificarSesion();
    const btnGuardar = document.getElementById("btnGuardarCambios");
    const btnCancelar = document.getElementById("btn_cancelarCambios");

    if (btnGuardar) {
        btnGuardar.removeEventListener("click", guardarCambiosItem);
        btnGuardar.addEventListener("click", guardarCambiosItem);
    }

    if (btnCancelar) {
        btnCancelar.removeEventListener("click", limpiar_gestion_materiales);
        btnCancelar.addEventListener("click", limpiar_gestion_materiales);
    }


    // === NOMBRE ===
    const nombre = document.getElementById("nombre");
    nombre.addEventListener("keypress", filtraNumerosLetras, false);
    nombre.addEventListener("keypress", limitarCaracteres50, false);
    nombre.addEventListener("keyup", capitalizarPrimeraLetra, false);
    nombre.addEventListener("keyup", bloquearEspacios, false);


    // === NÚMERO DE SERIE ===
    const serie = document.getElementById("numero_serie");
    serie.addEventListener("keypress", filtraNumerosLetras, false); // tu lógica personalizada
    serie.addEventListener("keypress", limitarCaracteres50, false);
    serie.addEventListener("keyup", bloquearEspacios, false);

    // === CANTIDAD ===
    const cantidad = document.getElementById("cantidad");
    cantidad.addEventListener("keydown", bloquearCopyPaste, false);
    cantidad.addEventListener("keydown", filtraNumeros, false);
    cantidad.addEventListener("keypress", limitarCaracteres6, false);
    cantidad.addEventListener("keyup", bloquearEspacios, false);

    // === PRECIO ===
    const precio = document.getElementById("precio");
    precio.addEventListener("keypress", limitarCaracteres10, false);
    precio.addEventListener("keyup", bloquearEspacios, false);

    // === UBICACIÓN ===
    const ubicacion = document.getElementById("ubicacion");
    ubicacion.addEventListener("keypress", filtraNumerosLetrasConEspacio, false);
    ubicacion.addEventListener("keypress", limitarCaracteres100, false);
    ubicacion.addEventListener("keyup", bloquearEspacios, false);

    // === DESCRIPCIÓN ===
    const descripcion = document.getElementById("descripcion");
    descripcion.addEventListener("keypress", filtraNumerosLetrasConEspacio, false); // texto limpio
    descripcion.addEventListener("keypress", limitarCaracteres300, false);
    descripcion.addEventListener("keyup", bloquearEspacios, false);

    // === IMAGEN ===
    const imagen = document.getElementById("imagen");
    if (imagen) imagen.addEventListener("change", validarImagenItem, false);

}
