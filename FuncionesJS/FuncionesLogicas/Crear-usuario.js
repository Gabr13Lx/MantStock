let con_max_usr, con_alta_db;
let nombre, apellido, correo, contrasena;

function registrarUsuario() {
    verificarSesion();
    nombre = document.getElementById("nombre").value;
    apellido = document.getElementById("apellido").value;

    if (nombre && apellido) {
        ajaxCorreoContrasena(); // Aquí no seguimos el flujo, solo llamamos
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Nombre y Apellido son obligatorios"
        });
    }
}

function ajaxCorreoContrasena() {
    verificarSesion();
    con_max_usr = crearAjax();
    con_max_usr.onreadystatechange = esperaCrearCorreo;
    con_max_usr.open("POST", "../ConexionesPHP/Funciones/buscarMaxID.php", true);
    con_max_usr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con_max_usr.send();
}

function esperaCrearCorreo() {
    verificarSesion();
    if (con_max_usr.readyState == 4 && con_max_usr.status == 200) {
        // Generamos correo y contraseña una vez recibida la respuesta
        let id_nuevo = parseInt(con_max_usr.responseText) + 1;
        correo = nombre + apellido + id_nuevo + "@bev.mx";
        contrasena = id_nuevo + nombre + apellido;

        // Insertamos los valores en los inputs
        document.getElementById("correo").value = correo;
        document.getElementById("password").value = contrasena;


        if (correo && contrasena) {
            altaDataBaseUsr();
        }
    }
}

function altaDataBaseUsr() {
    verificarSesion();
    nombre = document.getElementById("nombre").value;
    apellido = document.getElementById("apellido").value;
    correo = document.getElementById("correo").value;
    contrasena = document.getElementById("password").value;

    con_alta_db = crearAjax();
    con_alta_db.onreadystatechange = esperaAltaDB;
    con_alta_db.open("POST", "../conexionesPHP/Funciones/altaUsuario.php", true);
    con_alta_db.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    con_alta_db.send(
        "nombre=" + encodeURIComponent(nombre) +
        "&apellido=" + encodeURIComponent(apellido) +
        "&correo=" + encodeURIComponent(correo) +
        "&contrasena=" + encodeURIComponent(contrasena)
    );

}

function esperaAltaDB() {
    verificarSesion();
    if (con_alta_db.readyState == 4 && con_alta_db.status == 200) {
        if (con_alta_db.responseText == "Registrado") {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "El usuario se registró correctamente",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo registrar el usuario por: " + con_alta_db.responseText
            });
        }
    }
}