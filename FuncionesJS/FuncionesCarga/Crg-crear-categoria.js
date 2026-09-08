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

let carg_conexion_cerrarSesion, carg_conexion_crear_categoria;

function cargar() {
    verificarSesion();
    // Cargar y mostrar nombre del usuario (función definida en otro archivo)
    cargarNombreUsuario();

    // === EVENTOS DE BOTONES ===
    document.getElementById("btnCerrarSesion").addEventListener("click", AjaxCerrarSesion, false);
    document.getElementById("btnLimpiarCategoria").addEventListener("click", limpiarCrearCategoria, false);
    document.getElementById("btnCrearCategoria").addEventListener("click", AjaxcategoriaCrearCategoria, false);

    // === VALIDACIONES EN TIEMPO REAL: NOMBRE DE CATEGORÍA ===
    const inputNombre = document.getElementById("nombre_categoria");
    inputNombre.addEventListener("keypress", filtraLetras, false);                    // Solo letras + espacio después del primer caracter
    inputNombre.addEventListener("input", capitalizarPrimeraLetra, false);            // Capitaliza primera letra
    inputNombre.addEventListener("keypress", limitarCaracteres20, false);             // Máx. 20 caracteres

    // === VALIDACIONES EN TIEMPO REAL: DESCRIPCIÓN DE CATEGORÍA ===
    const inputDescripcion = document.getElementById("descripcion_categoria");
    inputDescripcion.addEventListener("keypress", filtraNumerosLetrasConEspacio, false); // Letras, números y espacios permitidos
    inputDescripcion.addEventListener("input", capitalizarPrimeraLetra, false);          // Capitaliza primera letra
    inputDescripcion.addEventListener("keypress", limitarCaracteres300, false);          // Máx. 300 caracteres
}
