# API de MantStock - Documentación de Endpoints

Este documento describe los endpoints principales del sistema MantStock.
**Nota:** Este archivo es solo documentación; no modifica el comportamiento del sistema.

## Endpoints identificados en el proyecto

### 1. registrarItem.php
- **Ubicación:** `ConexionesPHP/Funciones/registrarItem.php`
- **Propósito:** Registrar un nuevo ítem en el inventario.
- **Método:** POST (form-data)
- **Parámetros esperados:** nombre, categoría, cantidad.

### 2. buscarItemPorID.php
- **Ubicación:** `ConexionesPHP/Funciones/buscarItemPorID.php`
- **Propósito:** Buscar un ítem por su ID.
- **Método:** GET (query string)
- **Parámetros esperados:** id.

### 3. buscarNombre.php
- **Ubicación:** `ConexionesPHP/Funciones/buscarNombre.php`
- **Propósito:** Buscar ítems por nombre.

### 4. crearCategoria.php
- **Ubicación:** `ConexionesPHP/Funciones/crearcategoria.php`
- **Propósito:** Crear una nueva categoría.

### 5. movimientos_ajax.php
- **Ubicación:** `ConexionesPHP/Funciones/movimientos_ajax.php`
- **Propósito:** Consultar movimientos de stock vía AJAX.

## Convenciones del proyecto

- Los endpoints PHP devuelven JSON.
- Los archivos JS están organizados por función en `FuncionesJS/`.
- Las vistas están en `Interfaces/`.
- Los estilos en `Style/`.

## Autor
Equipo MantStock - Grupo 1002