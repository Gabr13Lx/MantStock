# Usamos la imagen oficial de PHP 8.2 con Apache
FROM php:8.2-apache

# Instalamos las extensiones necesarias (mysqli y pdo_mysql) para conectar con MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Habilitamos el módulo de reescritura de Apache (útil para rutas amigables)
RUN a2enmod rewrite

# Copiamos todo el proyecto al directorio raíz de Apache
COPY . /var/www/html/

# Creamos la carpeta uploads y le damos permisos a Apache
RUN mkdir -p /var/www/html/uploads && chown -R www-data:www-data /var/www/html/uploads && chmod -R 775 /var/www/html/uploads

# Exponemos el puerto 80
EXPOSE 80

# COMANDO CRÍTICO: Inicia Apache en primer plano para que el contenedor no se apague
CMD ["apache2-foreground"]