function registrarMovimiento() {
    verificarSesion();
    const form = document.getElementById("formMovimiento");
    const datos = new FormData(form);

    if (!datos.get("id_material")) {
        Swal.fire("Error", "No se especificó el material a mover", "error");
        return;
    }

    datos.append("accion", "registrar");

    const botonRegistrar = form.querySelector('button[type="submit"]');
    botonRegistrar.disabled = true;

    const ajax = crearAjax();
    ajax.open("POST", "../ConexionesPHP/Funciones/movimientos-usuario.php");

    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            botonRegistrar.disabled = false;
            if (ajax.status === 200) {
                const res = ajax.responseText.trim();
                if (res === "ok") {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Movimiento registrado correctamente",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    modalMovimiento.hide();
                    const termino = document.getElementById("busqueda_material").value;
                    if (termino.length >= 2) buscarMateriales(termino);
                    form.reset();
                } else {
                    Swal.fire("Error", res, "error");
                }
            } else {
                Swal.fire("Error", "Error de conexión con el servidor", "error");
            }
        }
    };

    ajax.send(datos);
}
