function cargarUsuariosCorreo() {
    verificarSesion();
    const selectUsuario = document.getElementById("usuario");

    const ajax = crearAjax();
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            const respuesta = ajax.responseText.trim();
            selectUsuario.innerHTML = "";

            if (!respuesta || respuesta.startsWith("sin_usuarios") || respuesta.startsWith("error")) {
                const sinOpciones = document.createElement("option");
                sinOpciones.value = "";
                sinOpciones.textContent = "Sin usuarios disponibles";
                sinOpciones.disabled = true;
                selectUsuario.appendChild(sinOpciones);
                selectUsuario.disabled = true;
                return;
            }

            const filas = respuesta.split("\n");
            const fragment = document.createDocumentFragment();

            // Opción por defecto
            const opcionDefault = document.createElement("option");
            opcionDefault.value = "";
            opcionDefault.textContent = "Seleccione un usuario";
            opcionDefault.selected = true;
            opcionDefault.disabled = false;
            fragment.appendChild(opcionDefault);


            filas.forEach(fila => {
                const partes = fila.split(",");
                let id = "";
                let correo = "";

                partes.forEach(parte => {
                    const [clave, valor] = parte.split(":");
                    if (clave === "id_usuario") id = valor;
                    else if (clave === "correo") correo = valor;
                });

                if (id && correo) {
                    const opcion = document.createElement("option");
                    opcion.value = id;
                    opcion.textContent = correo;
                    fragment.appendChild(opcion);
                }
            });

            selectUsuario.appendChild(fragment);
            selectUsuario.disabled = false;
        }
    };

    ajax.open("GET", "../ConexionesPHP/Funciones/correo-usuario.php", true);
    ajax.send();
}
