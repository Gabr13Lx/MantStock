// Asigna 'cargar' al evento 'load' con soporte para navegadores antiguos
/*Saca referencia para funcionar de los siguientes archivos:
* AjaxCerrarSesion.js   
* AjaxBuscarNombre.js
* CrearAjax.js
* AjaxBuscarMateriales.js
* AjaxRegistrarMovimiento.js
*/

add(window, 'load', cargar, false);
// Agrega eventos de forma compatible (IE antiguo y modernos)
function add(ele, eve, fun, cap) {
    if (window.attachEvent) {
        ele.attachEvent('on' + eve, fun);
    } else {
        ele.addEventListener(eve, fun, cap);
    }
}

// Archivo: main.js o movimientos-usuario.js

let carg_conexion_cerrarSesion;
let modalMovimiento;

// Entry point
function cargar() {
    verificarSesion();
    cargarCategoriasBusqueda();
    cargarNombreUsuario(); // ya lo usas
    add(document.getElementById("btnCerrarSesion"), "click", AjaxCerrarSesion, false);

    const busqueda = document.getElementById("busqueda_material");
    busqueda.addEventListener("keypress", filtraNumerosLetras, false);
    busqueda.addEventListener("keypress", limitarCaracteres50, false);
    busqueda.addEventListener("keyup", capitalizarPrimeraLetra, false);
    // === EVENTOS PARA MOVIMIENTOS ===
    const inputBusqueda = document.getElementById("busqueda_material");
    if (inputBusqueda) {
        add(inputBusqueda, "input", function () {
            if (inputBusqueda.value.trim().length >= 2) {
                buscarMateriales(inputBusqueda.value.trim());
            } else {
                document.getElementById("tabla_resultados").innerHTML = "";
            }
        }, false);
    }

    const formMovimiento = document.getElementById("formMovimiento");
    if (formMovimiento) {
        add(formMovimiento, "submit", function (e) {
            e.preventDefault();
            registrarMovimiento();
        }, false);
    }

    // Inicializa modal para control externo
    const modalEl = document.getElementById("modalMovimiento");
    if (modalEl) {
        modalMovimiento = new bootstrap.Modal(modalEl);
    }
}


function mostrarFormularioMovimiento(id_material) {
    const inputHidden = document.getElementById("id_material_modal");
    if (inputHidden) {
        inputHidden.value = id_material;
        document.getElementById("motivo_movimiento").addEventListener("keyup", capitalizarPrimeraLetra, false);
        document.getElementById("observaciones_movimiento").addEventListener("keyup", capitalizarPrimeraLetra, false);

    }
    if (modalMovimiento) {
        modalMovimiento.show();
    }
}
