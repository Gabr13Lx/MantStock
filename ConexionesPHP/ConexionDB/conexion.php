<?php
// Lee las variables de entorno de Docker. Si no existen (local), usa valores por defecto.
$host = getenv('DB_HOST') ?: 'mantstock-db';
$user = getenv('DB_USER') ?: 'root';
$pass = getenv('DB_PASSWORD') ?: 'root';
$dbname = getenv('DB_NAME') ?: 'MantStock';

// Crea la conexión
$cn = new mysqli($host, $user, $pass, $dbname);

// Verifica si hay errores
if ($cn->connect_error) {
    die("Error de conexión: " . $cn->connect_error);
}
?>