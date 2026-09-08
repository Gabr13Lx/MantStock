// ❌ Bloquea el uso de espacios
function filtraEspacios(event) {
    const teclaFiltraEspacio = event.keyCode;
    if (teclaFiltraEspacio === 32) {
        event.returnValue = false;
    }
}

// ✅ Solo permite números (0-9)
function filtraNumeros(event) {
    const teclaNumerica = event.keyCode;
    if (teclaNumerica >= 48 && teclaNumerica <= 57) {
        event.returnValue = true;
    } else {
        event.returnValue = false;
    }
}

function filtraLogin(event) {
    const teclaFiltrada = event.key;
    const valorInput = event.target.value;
    const codigoTecla = event.keyCode;

    const esNumeroValido = codigoTecla >= 48 && codigoTecla <= 57;
    const esLetraMayus = codigoTecla >= 65 && codigoTecla <= 90;
    const esLetraMinus = codigoTecla >= 97 && codigoTecla <= 122;
    const esLetraAcentuada = codigoTecla >= 192 && codigoTecla <= 255;
    const esEnie = codigoTecla === 209 || codigoTecla === 241;

    if (esNumeroValido || esLetraMayus || esLetraMinus || esLetraAcentuada || esEnie) {
        return; // Permitido
    }

    // Permitir solo una vez @ y .
    if (teclaFiltrada === "@" || teclaFiltrada === ".") {
        if (!valorInput.includes(teclaFiltrada)) return;
    }

    event.preventDefault(); // Bloquear el resto
}

// ✅ Solo letras en el primer carácter, luego letras o espacios (máximo 3 espacios)
function filtraLetras(event) {
    const input = event.target;
    const valor = input.value;
    const tecla = event.key;
    const codigo = event.keyCode;

    const esLetra =
        (codigo >= 65 && codigo <= 90) ||      // A-Z
        (codigo >= 97 && codigo <= 122) ||     // a-z
        codigo === 209 || codigo === 241 ||    // Ñ, ñ
        (codigo >= 192 && codigo <= 255);      // Letras con acento

    const esEspacio = codigo === 32;

    // Contamos los espacios actuales en el valor
    const espaciosActuales = (valor.match(/ /g) || []).length;

    // === Si el campo está vacío, solo se permite una letra
    if (valor.length === 0) {
        if (esLetra) {
            event.returnValue = true;
        } else {
            event.returnValue = false;
        }
        return;
    }

    // === Validar que el primer carácter ya presente en el input sea una letra
    const primerCaracter = valor.charAt(0);
    const codigoPrimero = primerCaracter.charCodeAt(0);
    const primerEsLetra =
        (codigoPrimero >= 65 && codigoPrimero <= 90) ||      // A-Z
        (codigoPrimero >= 97 && codigoPrimero <= 122) ||     // a-z
        codigoPrimero === 209 || codigoPrimero === 241 ||    // Ñ, ñ
        (codigoPrimero >= 192 && codigoPrimero <= 255);      // Letras con acento

    // === IF PRINCIPAL: solo permite interacción si el primer carácter ya es una letra ===
    if (primerEsLetra) {
        // Sub-if: si se presiona espacio
        if (esEspacio) {
            if (espaciosActuales >= 3) {
                event.returnValue = false; // Ya hay 3 espacios → bloquear
            } else {
                event.returnValue = true; // Menos de 3 espacios → permitir
            }
        }
        // Sub-if: si es letra → permitir
        else if (esLetra) {
            event.returnValue = true;
        }
        // Todo lo demás → bloquear
        else {
            event.returnValue = false;
        }
    } else {
        // Si el primer carácter no es una letra → bloquear cualquier tecla
        event.returnValue = false;
    }
}




// ✅ Letras, números, guiones y espacios (sin símbolos especiales)
function filtraNumerosLetras(event) {
    const teclaFiltrada = event.key;
    const valorInput = event.target.value;
    const codigoTecla = event.keyCode;

    const esNumeroValido = codigoTecla >= 48 && codigoTecla <= 57;
    const esLetraMayus = codigoTecla >= 65 && codigoTecla <= 90;
    const esLetraMinus = codigoTecla >= 97 && codigoTecla <= 122;
    const esLetraAcentuada = codigoTecla >= 192 && codigoTecla <= 255;
    const esEnie = codigoTecla === 209 || codigoTecla === 241;

    if (esNumeroValido || esLetraMayus || esLetraMinus || esLetraAcentuada || esEnie || teclaFiltrada === " " || teclaFiltrada === "-" || teclaFiltrada === "_") {
        return; // Permitido
    }

    // Permitir solo una vez @ y .
    if (teclaFiltrada === "@" || teclaFiltrada === ".") {
        if (!valorInput.includes(teclaFiltrada)) return;
    }

    event.preventDefault(); // Bloquear el resto
}

// ✅ Letras, números, espacios, guiones y guiones bajos (sin símbolos)
function filtraNumerosLetrasConEspacio(event) {
    const teclaCaracter = event.key;
    const valorCampo = event.target.value;
    const codigoCaracter = event.keyCode;

    const esNumeroCampo = codigoCaracter >= 48 && codigoCaracter <= 57;
    const esMayusculaCampo = codigoCaracter >= 65 && codigoCaracter <= 90;
    const esMinusculaCampo = codigoCaracter >= 97 && codigoCaracter <= 122;
    const esConAcentoCampo = codigoCaracter >= 192 && codigoCaracter <= 255;
    const esEnieCampo = codigoCaracter === 209 || codigoCaracter === 241;
    const esEspacioCampo = codigoCaracter === 32;

    if (esNumeroCampo || esMayusculaCampo || esMinusculaCampo || esConAcentoCampo || esEnieCampo || esEspacioCampo || teclaCaracter === "-" || teclaCaracter === "_" || teclaCaracter === "," || teclaCaracter === ".") {
        event.returnValue = true;
    } else {
        event.returnValue = false;
    }
}

// Limita a 6 caracteres
function limitarCaracteres6(event) {
    const inputLimite6 = event.target;
    if (inputLimite6.value.length >= 6) event.preventDefault();
}

// Limita a 10 caracteres
function limitarCaracteres10(event) {
    const inputLimite10 = event.target;
    if (inputLimite10.value.length >= 10) event.preventDefault();
}

// Limita a 20 caracteres
function limitarCaracteres20(event) {
    const inputLimite20 = event.target;
    if (inputLimite20.value.length >= 20) event.preventDefault();
}

// Limita a 30 caracteres
function limitarCaracteres30(event) {
    const inputLimite30 = event.target;
    if (inputLimite30.value.length >= 30) event.preventDefault();
}

// Limita a 50 caracteres
function limitarCaracteres50(event) {
    const inputLimite50 = event.target;
    if (inputLimite50.value.length >= 50) event.preventDefault();
}

// Limita a 100 caracteres
function limitarCaracteres100(event) {
    const inputLimite100 = event.target;
    if (inputLimite100.value.length >= 100) event.preventDefault();
}

// Limita a 300 caracteres
function limitarCaracteres300(event) {
    const inputLimite300 = event.target;
    if (inputLimite300.value.length >= 300) event.preventDefault();
}




// ❌ Bloquea copiar, pegar, cortar (teclado y mouse)
function bloquearCopyPaste(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'v' || event.key === 'x')) {
        event.preventDefault();
        return;
    }
    if (event.type === 'paste' || event.type === 'copy' || event.type === 'cut') {
        event.preventDefault();
        return;
    }
}

// ✅ Capitaliza primera letra y obliga que el primer carácter sea una letra
function capitalizarPrimeraLetra(event) {
    const input = event.target;
    let texto = input.value;

    if (texto.length > 0) {
        let primerChar = texto.charAt(0);
        let codigo = primerChar.charCodeAt(0);

        const esLetra =
            (codigo >= 65 && codigo <= 90) ||   // A-Z
            (codigo >= 97 && codigo <= 122) ||  // a-z
            codigo === 209 || codigo === 241 || // Ñ ñ
            (codigo >= 192 && codigo <= 255);   // Letras acentuadas

        if (!esLetra) {
            // ❌ Si no es letra, elimina el primer carácter
            texto = texto.slice(1);
            input.value = texto;
            return;
        }

        // ✅ Si es letra, capitaliza primera letra y el resto minúsculas
        const nuevoTexto = primerChar.toUpperCase() + texto.slice(1).toLowerCase();
        if (texto !== nuevoTexto) {
            const cursorPos = input.selectionStart;
            input.value = nuevoTexto;
            input.setSelectionRange(cursorPos, cursorPos);
        }
    }
}



// ✅ Validación de archivo de imagen: tipo y tamaño (máx 2MB, jpg/png/webp)
function validarImagenItem(event) {
    const archivo = event.target.files[0];

    if (archivo) {
        const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 2 * 1024 * 1024; // 2 MB

        if (!tiposPermitidos.includes(archivo.type)) {
            Swal.fire("Error", "Formato inválido. Solo se permiten JPG, PNG y WEBP", "error");
            event.target.value = "";
            return;
        }

        if (archivo.size > maxSize) {
            Swal.fire("Error", "La imagen no debe exceder los 2 MB", "error");
            event.target.value = "";
        }
    }
}


// ✅ Bloquea espacio en primer carácter y evita dobles espacios
function bloquearEspacios(event) {
    const input = event.target;
    let texto = input.value;
    let cursorPos = input.selectionStart;

    // Si el usuario intenta poner un espacio al inicio
    if (texto.length === 1 && texto === " ") {
        input.value = "";
        return;
    }

    // Reemplazar múltiples espacios seguidos por solo uno
    let nuevoTexto = texto.replace(/\s{2,}/g, " ");

    // Evita espacios al inicio (si pegó texto con espacios)
    nuevoTexto = nuevoTexto.replace(/^\s+/, "");

    if (texto !== nuevoTexto) {
        input.value = nuevoTexto;
        // Reajusta la posición del cursor
        input.setSelectionRange(cursorPos - 1, cursorPos - 1);
    }
}


function bloquearEspaciosAlPegarInformacion(event) {
    // Elimina todos los espacios del input que disparó el evento
    event.target.value = event.target.value.replace(/\s+/g, '');
}