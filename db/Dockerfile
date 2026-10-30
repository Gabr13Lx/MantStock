# ============================================
# Dockerfile - MantStock DB (MySQL)
# ============================================
FROM mysql:8.0

LABEL maintainer="Equipo 01 - UTVF"

# Variables por defecto (se pueden sobreescribir)
ENV MYSQL_ROOT_PASSWORD=rootpass
ENV MYSQL_DATABASE=mantstock
ENV MYSQL_USER=mantstock_user
ENV MYSQL_PASSWORD=mantstock_pass

# Scripts SQL que se ejecutan al inicializar la BD
COPY ../Database/ /docker-entrypoint-initdb.d/

EXPOSE 3306