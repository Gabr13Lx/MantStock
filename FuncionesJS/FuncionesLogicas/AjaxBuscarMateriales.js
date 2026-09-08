function buscarMateriales(termino) {
    verificarSesion();
    const ubicacion_plan = document.getElementById("Ubicacion_almacen_busqueda");
    const almacen_ubi = ubicacion_plan.value;
    const plantasValidas = ["Agua", "Latas", "Jugos", "Todos"];
    const categoria_busqueda = document.getElementById("id_categoria").value;
    if (!plantasValidas.includes(almacen_ubi)) {
        Swal.fire({
            position: "defaul",
            icon: "info",
            title: "Planta de la busqueda invalida",
            showConfirmButton: false,
            timer: 1500
        });
        return;
    }
    const ajax = crearAjax();
    ajax.open("POST", "../ConexionesPHP/Funciones/movimientos-usuario.php");
    ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4 && ajax.status === 200) {
            document.getElementById("tabla_resultados").innerHTML = ajax.responseText;
        }
    };

    ajax.send("accion=buscar&termino=" + encodeURIComponent(termino) + "&plan_ubicacion=" + encodeURIComponent(almacen_ubi) + "&categoria_busqueda=" + encodeURIComponent(categoria_busqueda));
}