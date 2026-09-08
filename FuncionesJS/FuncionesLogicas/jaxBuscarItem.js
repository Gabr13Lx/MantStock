document.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    const almancen_planta = document.getElementById("Ubicacion_almacen_busqueda");
    const inputNombre = document.getElementById("material-a-modificar");
    const selectCoincidencias = document.getElementById("coincidencias-materiales");

    inputNombre.addEventListener("keyup", () => {
        const texto = inputNombre.value.trim();
        const almacen_ubi = almancen_planta.value; // ← Obtener valor correctamente

        if (texto.length === 0) {
            selectCoincidencias.innerHTML = `<option disabled selected>Escriba el nombre del material</option>`;
            return;
        }

        if (texto.length < 2) {
            selectCoincidencias.innerHTML = `<option disabled selected>Mínimo 2 caracteres para buscar</option>`;
            return;
        }

        const plantasValidas = ["Agua", "Latas", "Jugos", "Todos"];
        if (!plantasValidas.includes(almacen_ubi)) {
            selectCoincidencias.innerHTML = `<option disabled selected>Seleccione la Planta</option>`;
            return;
        }

        const ajax = crearAjax();
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4 && ajax.status === 200) {
                try {
                    const respuesta = JSON.parse(ajax.responseText);

                    if (respuesta.error) {
                        const mensaje = respuesta.error.toLowerCase();
                        if (
                            mensaje.includes("mínimo 2 caracteres") ||
                            mensaje.includes("escribe el nombre") ||
                            mensaje.includes("no se encontraron") ||
                            mensaje.includes("selecciona la planta")
                        ) {
                            selectCoincidencias.innerHTML = `<option disabled selected>${respuesta.error}</option>`;
                            return;
                        }

                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: respuesta.error,
                        });
                        selectCoincidencias.innerHTML = `<option disabled selected>Error al buscar</option>`;
                        return;
                    }

                    const materiales = respuesta.materiales;
                    const fragment = document.createDocumentFragment();

                    selectCoincidencias.innerHTML = '';
                    const placeholder = document.createElement('option');
                    placeholder.textContent = "Coincidencias encontradas...";
                    placeholder.disabled = true;
                    placeholder.selected = true;
                    selectCoincidencias.appendChild(placeholder);

                    materiales.forEach((mat) => {
                        const option = document.createElement("option");
                        option.value = mat.id_item;
                        option.textContent = mat.nombre;
                        fragment.appendChild(option);
                    });

                    selectCoincidencias.appendChild(fragment);
                } catch (e) {
                    console.error("Error al procesar respuesta:", e);
                    Swal.fire({
                        icon: "error",
                        title: "Error inesperado",
                        text: "La respuesta del servidor no se pudo interpretar.",
                    });
                    selectCoincidencias.innerHTML = `<option disabled selected>Error al cargar resultados</option>`;
                }
            }
        };

        ajax.open("POST", "../ConexionesPHP/Funciones/buscarItemPorID.php", true);
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.send("nombre=" + encodeURIComponent(texto) + "&ubicacion=" + encodeURIComponent(almacen_ubi));
    });
});
