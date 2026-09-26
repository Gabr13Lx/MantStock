<?php
/**
 * Script de pruebas automatizadas para MantStock
 * Ejecuta validaciones básicas sin necesidad de BD real.
 * Retorna exit(0) si todo pasa, exit(1) si algo falla.
 */

echo "========================================\n";
echo "  Pruebas automatizadas - MantStock     \n";
echo "========================================\n\n";

$errores = 0;
$pruebas = 0;

// ------------------------------------------------------------
// PRUEBA 1: Validar sintaxis de todos los .php del proyecto
// ------------------------------------------------------------
echo "[1] Validando sintaxis PHP...\n";
$phpFiles = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator(__DIR__ . '/../ConexionesPHP')
);
foreach ($phpFiles as $file) {
    if ($file->isFile() && $file->getExtension() === 'php') {
        $pruebas++;
        $output = [];
        $retval = 0;
        exec('php -l ' . escapeshellarg($file->getPathname()) . ' 2>&1', $output, $retval);
        if ($retval !== 0) {
            echo "  X ERROR en: " . $file->getPathname() . "\n";
            echo "    " . implode("\n    ", $output) . "\n";
            $errores++;
        }
    }
}
echo "  -> Archivos PHP revisados: $pruebas\n\n";

// ------------------------------------------------------------
// PRUEBA 2: Verificar existencia de archivos clave
// ------------------------------------------------------------
echo "[2] Verificando archivos clave...\n";
$archivosClave = [
    __DIR__ . '/../index.html',
    __DIR__ . '/../ConexionesPHP/ConexionDB/conexion.php',
    __DIR__ . '/../README.md',
];
foreach ($archivosClave as $archivo) {
    $pruebas++;
    if (file_exists($archivo)) {
        echo "  OK Existe: " . basename($archivo) . "\n";
    } else {
        echo "  X FALTA: " . $archivo . "\n";
        $errores++;
    }
}
echo "\n";

// ------------------------------------------------------------
// PRUEBA 3: Simular validación de conexión (sin BD real)
// ------------------------------------------------------------
echo "[3] Simulando validación de conexión a BD...\n";
$pruebas++;
$host = getenv('DB_HOST') ?: 'localhost';
$user = getenv('DB_USER') ?: 'test_user';
$pass = getenv('DB_PASS') ?: 'test_pass';
$name = getenv('DB_NAME') ?: 'mantstock_test';

if (!empty($host) && !empty($user) && !empty($name)) {
    echo "  OK Variables de conexión definidas (host=$host, db=$name)\n";
} else {
    echo "  X Variables de conexión incompletas\n";
    $errores++;
}
echo "\n";

// ------------------------------------------------------------
// PRUEBA 4: Validar que existan archivos JS del proyecto
// ------------------------------------------------------------
echo "[4] Verificando archivos JavaScript...\n";
$jsDir = __DIR__ . '/../FuncionesJS';
if (is_dir($jsDir)) {
    $jsFiles = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($jsDir)
    );
    $countJs = 0;
    foreach ($jsFiles as $file) {
        if ($file->isFile() && $file->getExtension() === 'js') {
            $countJs++;
        }
    }
    $pruebas++;
    echo "  OK Archivos JS encontrados: $countJs\n";
    if ($countJs === 0) {
        echo "  X No se encontraron archivos JS\n";
        $errores++;
    }
} else {
    echo "  X No existe la carpeta FuncionesJS\n";
    $errores++;
}
echo "\n";

// ------------------------------------------------------------
// RESULTADO FINAL
// ------------------------------------------------------------
echo "========================================\n";
echo "  RESULTADO: $pruebas pruebas ejecutadas\n";
echo "  Errores: $errores\n";
echo "========================================\n";

if ($errores === 0) {
    echo "[OK] TODAS LAS PRUEBAS PASARON\n";
    exit(0);
} else {
    echo "[FALLO] HAY $errores ERROR(ES)\n";
    exit(1);
}