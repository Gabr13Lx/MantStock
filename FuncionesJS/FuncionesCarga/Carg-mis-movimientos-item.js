// === Asignación compatible de eventos ===
add(window, 'load', cargar, false);

function add(ele, eve, fun, cap) {
    if (window.attachEvent) {
        ele.attachEvent('on' + eve, fun);
    } else {
        ele.addEventListener(eve, fun, cap);
    }
}

// === Variables globales si necesitas ===
let carg_conexion_cerrarSesion;

// === Función principal al cargar ===
function cargar() {
    verificarSesion();
    cargarNombreUsuario();
    document.getElementById("btnCerrarSesion").addEventListener("click", AjaxCerrarSesion, false);
    document.getElementById("nombre_material").addEventListener("keyup", capitalizarPrimeraLetra, false);

    cargarCategorias();

    // Asignación de eventos a los filtros
    add(document.getElementById("formFiltros"), "submit", enviarFiltros, false);
    add(document.getElementById("limpiarFiltros"), "click", limpiarFiltros, false);
}


function limpiarFiltros() {
    verificarSesion();
    document.getElementById("formFiltros").reset();
    document.getElementById("tipo").value = "todos";
    document.getElementById("id_categoria").value = "";

    // Limpiar tabla
    document.getElementById("tabla_historial").innerHTML = "";
    cargarCategorias();
}

function formatearTextoLargo(texto, limite = 30) {
    if (!texto) return '';
    const regex = new RegExp(`(.{1,${limite}})`, 'g');
    return texto.match(regex).join('<br>');
}
