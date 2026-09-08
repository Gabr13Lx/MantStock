function AjaxcategoriaCrearCategoria(){
    verificarSesion();
    let nombre = document.getElementById("nombre_categoria").value.trim();
    let descripcion = document.getElementById("descripcion_categoria").value.trim();

    // Validamos que todos los campos cuenten con contenido
    if (nombre && descripcion) {
        carg_conexion_crear_categoria = crearAjax();
        carg_conexion_crear_categoria.onreadystatechange = esperaRespuestaCrearCategoria;
        carg_conexion_crear_categoria.open("POST", "../ConexionesPHP/Funciones/crearCategoria.php", true);
        carg_conexion_crear_categoria.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        carg_conexion_crear_categoria.send("nombre=" + nombre + "&descripcion=" + descripcion);
    } else {
        Swal.fire("Error", "Debes completar todos los campos", "error");
    }
}
function esperaRespuestaCrearCategoria(){
    verificarSesion();
    if (carg_conexion_crear_categoria.readyState === 4 && carg_conexion_crear_categoria.status === 200) {
            const res = carg_conexion_crear_categoria.responseText.trim();

            if (res === "exito") {
                Swal.fire({
                    icon: "success",
                    title: "Categoría creada exitosamente",
                    toast: true,
                    position: "top-end",
                    timer: 2000,
                    showConfirmButton: false
                });
                limpiarCrearCategoria();
            } else if (res === "existe") {
                Swal.fire("Ya existe", "Esa categoría ya está registrada.", "info");
            } else {
                Swal.fire("Error", res, "error");
            }
        }
}