# ============================================
# Dockerfile - MantStock Web (Apache + PHP)
# ============================================
FROM php:8.2-apache

LABEL maintainer="Equipo 01 - UTVF"
LABEL description="MantStock - Sistema de gestión de inventarios"

# Instalar extensiones PHP necesarias para conectar a MySQL
RUN docker-php-ext-install mysqli pdo pdo_mysql \
    && a2enmod rewrite

# Copiar el código del proyecto al DocumentRoot de Apache
COPY . /var/www/html/

# Crear carpeta uploads y dar permisos al usuario www-data
RUN mkdir -p /var/www/html/uploads \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 755 /var/www/html/uploads

# Exponer el puerto HTTP
EXPOSE 80

# Apache en primer plano (equivalente al ENTRYPOINT del artículo)
CMD ["apache2-foreground"]