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
    document.getElementById("btnGuardarCambiosCategoria").addEventListener("click", guardarCambiosCategoria, false);
    document.getElementById("btnLimpiarCategoria").addEventListener("click", limpiarCaposGestionarCategoria, false);
    document.getElementById("nombre-busqueda-categoria").addEventListener("keyup", capitalizarPrimeraLetra, false);
    // Evento para buscar coincidencias por nombre
    document.getElementById("nombre-busqueda-categoria").addEventListener("input", buscarCategoriaPorNombre, false);

    // Evento para cargar datos al seleccionar coincidencia
    document.getElementById("coincidencias-categorias").addEventListener("change", function () {
        const idSeleccionado = this.value;
        cargarDatosCategoriaPorID(idSeleccionado);
    }, false);
}
