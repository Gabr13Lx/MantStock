//carg_conexion_cerrarSesion de index.html para que el usuario haga login con sus credenciales
function AjaxCerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            carg_conexion_cerrarSesion = crearAjax();
            carg_conexion_cerrarSesion.onreadystatechange = function () {
                if (carg_conexion_cerrarSesion.readyState == 4) {
                    if (carg_conexion_cerrarSesion.responseText === "cerrado") {
                        window.location.href = "../index.html";
                    } else if (carg_conexion_cerrarSesion.responseText == "no-cerrado") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'No es posible Cerrar Sesión en este momento'
                        });
                    }
                }
            };
            carg_conexion_cerrarSesion.open("POST", "../ConexionesPHP/Funciones/cerrarSesion.php", true);
            carg_conexion_cerrarSesion.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            carg_conexion_cerrarSesion.send();
        }
    });
}

function AjaxCerrarSesionDirecto() {
    const carg_conexion_cerrarSesionA = crearAjax();
    carg_conexion_cerrarSesionA.onreadystatechange = function () {
        if (carg_conexion_cerrarSesionA.readyState === 4) {
            const respuesta = carg_conexion_cerrarSesionA.responseText.trim();

            if (respuesta === "cerrado") {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión cerrada por seguridad',
                    text: 'Tu sesión fue cerrada automáticamente por motivos de seguridad. Por favor, inicia sesión nuevamente.',
                    confirmButtonText: 'Entendido'
                }).then(() => {
                    window.location.href = "../index.html";
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cerrar sesión',
                    text: 'No se pudo cerrar tu sesión automáticamente. Por favor, recarga la página o cierra sesión manualmente.'
                });
            }
        }
    };
    carg_conexion_cerrarSesionA.open("POST", "../ConexionesPHP/Funciones/cerrarSesion.php", true);
    carg_conexion_cerrarSesionA.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    carg_conexion_cerrarSesionA.send();
}

function ForzarCerrarSesion() {
    const carg_conexion_cerrarSesionA = crearAjax();
    carg_conexion_cerrarSesionA.onreadystatechange = function () {
        if (carg_conexion_cerrarSesionA.readyState === 4) {
        } 
    };
    carg_conexion_cerrarSesionA.open("POST", "ConexionesPHP/Funciones/cerrarSesion.php", true);
    carg_conexion_cerrarSesionA.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    carg_conexion_cerrarSesionA.send();
}

