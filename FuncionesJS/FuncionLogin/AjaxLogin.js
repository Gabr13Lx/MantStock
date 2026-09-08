/*
* IMPORTANTE: Este código de login funciona con contraseñas cifradas mediante AHS.
* Sin embargo, al instalar por primera vez el sistema y crear manualmente los primeros administradores,
* estas contraseñas aún no están cifradas. Por ello, sigue los siguientes pasos para la correcta inicialización:

1. Inserta los administradores manualmente en la base de datos con contraseñas en texto plano:
   Ejemplo:
   INSERT INTO usuarios (primer_nombre, primer_apellido, correo, contrasena, rol) VALUES
   ('Nombre1', 'Apellido1', 'admin1@bev.mx', 'tu_contraseña', 'admin'),
   ('Nombre2', 'Apellido2', 'admin2@bev.mx', 'otra_contraseña', 'admin');

2. Temporalmente modifica la siguiente línea (linea 51):
   carg_conexion_login.open("POST", "ConexionesPHP/Login/logearse.php", true);
   Por esta otra, que permite el login con contraseñas sin cifrar:
   carg_conexion_login.open("POST", "ConexionesPHP/Login/logearsePlana.php", true);

   Nota: El archivo `logearsePlana.php` debe validar directamente la contraseña sin aplicar ningún hash.

3. Inicia sesión con una de las cuentas administradoras creadas.

4. Desde el panel administrativo, localiza a los demás administradores y restablece sus contraseñas.
   Esto hará que el sistema las cifre automáticamente (usando AHS o el algoritmo correspondiente).

5. También restablece la contraseña del usuario con el que iniciaste sesión (para que ahora también esté cifrada).

6. Finalmente, regresa la línea modificada a su versión original:
   carg_conexion_login.open("POST", "ConexionesPHP/Login/logearse.php", true);

   A partir de ese punto, el sistema funcionará correctamente validando contraseñas cifradas.
   Todos los nuevos usuarios serán dados de alta desde la interfaz web del sistema, y sus contraseñas estarán protegidas.

* Este procedimiento solo es necesario la primera vez que se instala el sistema.
*/


function ajaxConexionLogin() {
    let v_correo = document.getElementById("txt_correo").value.trim();
    let v_contrasena = document.getElementById("txt_contrasena").value.trim();

    // Validamos que todos los campos cuenten con contenido
    if (v_correo && v_contrasena) {
        // Validar que el correo tenga exactamente un @
        const cantidadArrobas = (v_correo.match(/@/g) || []).length;
        if (cantidadArrobas !== 1) {
            Swal.fire("Error", "El correo debe contener '@' ", "error");
            return;
        }

        carg_conexion_login = crearAjax();
        carg_conexion_login.onreadystatechange = esperaRespuestaLogin;
        carg_conexion_login.open("POST", "ConexionesPHP/Login/logearse.php", true);
        carg_conexion_login.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        carg_conexion_login.send("correo=" + v_correo + "&contrasena=" + v_contrasena);
    } else {
        Swal.fire("Error", "Debes completar los campos para iniciar sesión", "error");
    }
}


function esperaRespuestaLogin() {
    if (carg_conexion_login.readyState == 4) {
        if (carg_conexion_login.responseText === "administrador") {
            limpiarLoginCompleto();
            window.location.href = "Interfaces/pagina-principal-admin.html";
        } else if (carg_conexion_login.responseText === "usuario") {
            limpiarLoginCompleto();
            window.location.href = "Interfaces/pagina-principal-usuario.html";
        } else if (carg_conexion_login.responseText === "sin-acceso") {
            limpiarLoginCompleto();
            Swal.fire({ icon: 'error', title: 'Error de Ingreso', text: "Usuario Sin Permiso de Acceso" });
        } else if (carg_conexion_login.responseText === "sin-contraseña") {
            limpiarLogin();
            Swal.fire({ icon: 'error', title: 'Error de Ingreso', text: "Contrseña Incorrecta" });
        } else {
            limpiarLoginCompleto();
            Swal.fire({ icon: 'error', title: 'Credenciales incorrectas', text: "Usuario no encontrado" + carg_conexion_login.responseText });
        }
    }
}