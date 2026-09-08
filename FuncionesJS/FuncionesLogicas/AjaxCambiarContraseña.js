
let estructuraMostrada = false;

// Mostrar estructura con requisitos al hacer click la primera vez
function mostrarEstructuraContrasena() {
    verificarSesion();
    if (!estructuraMostrada) {
        estructuraMostrada = true;
        Swal.fire({
            icon: "info",
            title: "Requisitos de la contraseña",
            html: `
        La contraseña debe cumplir con:
        <ul style="text-align:left">
          <li>Mínimo 8 caracteres</li>
          <li>Al menos 1 letra mayúscula</li>
          <li>Al menos 1 letra minúscula</li>
          <li>Al menos 1 número</li>
        </ul>
      `,
            confirmButtonText: "Entendido"
        });
    }
}

// Validar sin bloquear botón, solo mostrar alertas según casos
function validarPasswords() {
    verificarSesion();
    const nuevaPass = document.getElementById('nueva_contraseña');
    const repetirPass = document.getElementById('repetir_contraseña');
    const btnActualizar = document.getElementById('btn_actualizar_contraseña');


    const nueva = nuevaPass.value.trim();
    const repetir = repetirPass.value.trim();

    // Nunca deshabilitamos el botón
    btnActualizar.disabled = false;

    if (nueva === '' && repetir === '') {
        Swal.fire({
            icon: 'info',
            title: 'Para actualizar debes llenar los campos siguiendo la siguiente estructura:',
            html: `
            <ul style="text-align:left">
                <li>Mínimo 8 caracteres</li>
                <li>Al menos 1 letra mayúscula</li>
                <li>Al menos 1 letra minúscula</li>
                <li>Al menos 1 número</li>
            </ul>`,
            confirmButtonText: 'Entendido'
        });
        return false;
    }

    if (nueva !== '' && repetir !== '') {
        if (!validaEstructura(nueva)) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseña inválida',
                html: `
                <ul style="text-align:left">
                    <li>Mínimo 8 caracteres</li>
                    <li>Al menos 1 letra mayúscula</li>
                    <li>Al menos 1 letra minúscula</li>
                    <li>Al menos 1 número</li>
                </ul>`,
                confirmButtonText: 'Corregir'
            });
            return false;
        }
        if (nueva !== repetir) {
            Swal.fire({
                icon: 'warning',
                title: 'Las contraseñas no coinciden',
                confirmButtonText: 'Corregir'
            });
            return false;
        }
        // Contraseñas válidas y coinciden
        return true;
    }

    // Si un campo está vacío y otro no, muestra recordatorio
    Swal.fire({
        icon: 'info',
        title: 'Completa ambos campos con la estructura requerida',
        html: `
        <ul style="text-align:left">
            <li>Mínimo 8 caracteres</li>
            <li>Al menos 1 letra mayúscula</li>
            <li>Al menos 1 letra minúscula</li>
            <li>Al menos 1 número</li>
        </ul>`,
        confirmButtonText: 'Entendido'
    });
    return false;
}

// Regex para validar estructura
function validaEstructura(pass) {
    verificarSesion();
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(pass);
}

// Cambiar contraseña pidiendo confirmación con SweetAlert y validando en backend vía AJAX
function cambiarContrasenaConValidacion() {
    verificarSesion();
    const nuevaPass = document.getElementById('nueva_contraseña');
    const repetirPass = document.getElementById('repetir_contraseña');
    const btnActualizar = document.getElementById('btn_actualizar_contraseña');

    const nueva = nuevaPass.value.trim();

    if (nueva === "") {
        Swal.fire('Error', 'Debes ingresar una nueva contraseña.', 'error');
        return;
    }

    // Antes de pedir contraseña actual, validar localmente la estructura y coincidencia
    if (!validarPasswords()) return;

    Swal.fire({
        title: 'Confirma tu contraseña actual',
        input: 'password',
        inputLabel: 'Contraseña actual',
        inputPlaceholder: 'Ingresa tu contraseña actual',
        inputAttributes: { autocapitalize: 'off', autocorrect: 'off' },
        showCancelButton: true,
    }).then((result) => {
        if (!result.isConfirmed) {
            Swal.fire('Cancelado', 'No se actualizó la contraseña.', 'info');
            limpiarCamposActualizarContrasena();
            return;
        }

        const passwordActual = result.value;
        if (!passwordActual) {
            Swal.fire('Error', 'Debes ingresar tu contraseña actual para continuar.', 'error');
            limpiarCamposActualizarContrasena();
            return;
        }

        const con_actializar_contrasena = crearAjax();
        con_actializar_contrasena.open('POST', '../ConexionesPHP/Funciones/actualizar-contrasena.php', true);
        con_actializar_contrasena.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        con_actializar_contrasena.onreadystatechange = function () {
            if (con_actializar_contrasena.readyState === 4) {
                const resp = con_actializar_contrasena.responseText.trim();

                if (resp === 'ok') {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: 'Tu contraseña fue actualizada.'
                    }).then(() => {
                        limpiarCamposActualizarContrasena();
                    });

                } else if (resp === 'contraseña-incorrecta') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'La contraseña actual es incorrecta.'
                    }).then(() => {
                        AjaxCerrarSesionDirecto();
                    });

                } else if (resp === 'sesion-invalida') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión inválida',
                        text: 'Tu sesión no es válida. Por favor, vuelve a iniciar sesión.'
                    }).then(() => {
                        AjaxCerrarSesionDirecto();
                    });

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error inesperado',
                        text: 'Ocurrió un error inesperado: ' + resp
                    }).then(() => {
                        AjaxCerrarSesionDirecto();
                    });
                }
            }

        };

        const params = `nueva_contrasena=${encodeURIComponent(nueva)}&actual_contrasena=${encodeURIComponent(passwordActual)}`;
        con_actializar_contrasena.send(params);
    });
}
