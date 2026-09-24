# Pruebas manuales - MantStock

**Nota:** Este documento es solo de referencia. No contiene scripts ejecutables ni modifica el sistema.

## Pruebas sugeridas para el módulo de inventario

### Prueba 1: Registrar ítem válido
- **Endpoint:** `registrarItem.php`
- **Datos:** nombre="Laptop HP", categoria=1, cantidad=10
- **Resultado esperado:** Ítem guardado en la BD.

### Prueba 2: Registrar ítem sin nombre
- **Endpoint:** `registrarItem.php`
- **Datos:** nombre="", categoria=1, cantidad=10
- **Resultado esperado:** El sistema debe rechazar la petición.

### Prueba 3: Buscar ítem por ID válido
- **Endpoint:** `buscarItemPorID.php?id=1`
- **Resultado esperado:** Devuelve el JSON del ítem.

### Prueba 4: Buscar ítem por ID inexistente
- **Endpoint:** `buscarItemPorID.php?id=99999`
- **Resultado esperado:** Devuelve vacío o error controlado.

## Responsable
Equipo MantStock - Práctica 2