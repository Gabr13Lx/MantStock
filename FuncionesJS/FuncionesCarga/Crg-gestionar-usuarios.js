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
    document.getElementById("btn_limpiar").addEventListener("click", limpiarGestionarUsuario, false);
    document.getElementById("btn_buscar").addEventListener("click", ajaxBuscarUsuario, false);
    document.getElementById("btn_reiniciar").addEventListener("click", ajaxRestablecerContrasena, false);
    // Activar la lógica dinámica cuando cambia el valor del campo estado
    document.getElementById("estado").addEventListener("input", actualizarBotonEstado, false);

    // Evento manual también para cuando ya se cargó un estado desde la búsqueda
    document.getElementById("btn_estado").addEventListener("click", manejarCambioEstadoUsuario, false);


    // Evento para filtrar caracteres en la busqueda.
     document.getElementById("numeroUsuario").addEventListener("keypress", filtraEspacios, false);
}