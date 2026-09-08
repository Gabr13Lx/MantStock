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
}