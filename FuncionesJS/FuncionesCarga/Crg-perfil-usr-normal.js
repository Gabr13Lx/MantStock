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
    // Evento para cerrar sesión
    document.getElementById("btnCerrarSesion").addEventListener("click", AjaxCerrarSesion, false);

    // Cargar datos del perfil y mostrar en la interfaz
    cargarDatosPerfil();

    // Referencias a inputs y botón de contraseña
    const nuevaPass = document.getElementById('nueva_contraseña');
    const repetirPass = document.getElementById('repetir_contraseña');
    const btnActualizar = document.getElementById('btn_actualizar_contraseña');

    // Eventos para interacción con campos de contraseña
    nuevaPass.addEventListener("click", mostrarEstructuraContrasena, false);  // Mostrar requisitos al hacer click
    nuevaPass.addEventListener("keypress", filtraEspacios, false);           // Evitar espacios
    repetirPass.addEventListener("keypress", filtraEspacios, false);

    // Evento para actualizar contraseña al presionar el botón
    btnActualizar.addEventListener('click', cambiarContrasenaConValidacion, false);
}
