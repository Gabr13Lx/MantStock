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
    document.getElementById("btn_limpiar").addEventListener("click", limpiarCrearUsuario, false);
    document.getElementById("btn_creaUsr").addEventListener("click", registrarUsuario, false);

    //Filtrar Letras
    document.getElementById("nombre").addEventListener("keypress", filtraLetras, false);
    document.getElementById("apellido").addEventListener("keypress", filtraLetras, false);
     document.getElementById("nombre").addEventListener("keypress", filtraEspacios, false);
    document.getElementById("apellido").addEventListener("keypress", filtraEspacios, false);

    //Filtra cantidad de caracteres
    document.getElementById("apellido").addEventListener("keypress", limitarCaracteres20, false);
    document.getElementById("nombre").addEventListener("keypress", limitarCaracteres20, false);
    //Capitalizar primera letra
    document.getElementById("nombre").addEventListener("keyup", capitalizarPrimeraLetra, false);
    document.getElementById("apellido").addEventListener("keyup", capitalizarPrimeraLetra, false);
    //Filtra Copiar o Pegar información
    document.getElementById("nombre").addEventListener("keydown", bloquearCopyPaste, false);
    document.getElementById("nombre").addEventListener("paste", bloquearCopyPaste, false);
    document.getElementById("nombre").addEventListener("copy", bloquearCopyPaste, false);
    document.getElementById("apellido").addEventListener("keydown", bloquearCopyPaste, false);
    document.getElementById("apellido").addEventListener("paste", bloquearCopyPaste, false);
    document.getElementById("apellido").addEventListener("copy", bloquearCopyPaste, false);
    
}
