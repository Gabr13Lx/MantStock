// Asigna 'cargar' al evento 'load' con soporte para navegadores antiguos
add(window, 'load', cargar, false);
// Agrega eventos de forma compatible (IE antiguo y modernos)
function add(ele, eve, fun, cap) {
    if (window.attachEvent) {
        ele.attachEvent('on' + eve, fun);//Navegador Antiguo
    } else {
        ele.addEventListener(eve, fun, cap);//Navegador Moderno
    }
}
let carg_conexion_login;
function cargar() {
    ForzarCerrarSesion();
    document.getElementById("btn_login").addEventListener("click", ajaxConexionLogin, false);
    document.getElementById("txt_correo").addEventListener("keypress", filtraLogin, false);
    document.getElementById("txt_contrasena").addEventListener("keypress", filtraLogin, false);
    document.getElementById("txt_correo").addEventListener("keypress", limitarCaracteres50, false);
    document.getElementById("txt_contrasena").addEventListener("keypress", limitarCaracteres50, false);
    document.getElementById("txt_correo").addEventListener("input", bloquearEspaciosAlPegarInformacion, false);
    document.getElementById("txt_contrasena").addEventListener("input", bloquearEspaciosAlPegarInformacion, false);
}
