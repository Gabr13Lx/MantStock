# Usamos la imagen oficial de PHP 8.2 con Apache
FROM php:8.2-apache

# Instalamos la extensión mysqli necesaria para conectar con MySQL
RUN docker-php-ext-install mysqli

# Copiamos todo el proyecto al directorio raíz de Apache
COPY . /var/www/html/

# Creamos la carpeta uploads y le damos permisos a Apache
RUN mkdir -p /var/www/html/uploads && chown -R www-data:www-data /var/www/html/uploads && chmod -R 775 /var/www/html/uploads

# Exponemos el puerto 80
EXPOSE 80