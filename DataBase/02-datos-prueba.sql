-- 1. Insertar Categorías (usando tu columna 'nombre')
INSERT INTO Categorias (nombre, descripcion) VALUES 
('Herramientas Manuales', 'Martillos, desarmadores, pinzas'),
('Equipos de Protección', 'Cascos, guantes, lentes de seguridad'),
('Refacciones', 'Tornillos, tuercas, arandelas');

-- 2. Insertar Materiales (respetando tus ENUM: Agua, Latas, Jugos / Unidad, Serie, Retornable)
INSERT INTO Materiales (nombre, descripcion, numero_serie, precio, cantidad, ubicacion, id_categoria, planta, tipo_gestion) VALUES 
('Martillo de Acero 16oz', 'Martillo de acero forjado con mango de fibra', NULL, 250, 15, 'Estante A1', 1, 'Agua', 'Unidad'),
('Desarmador de Cruz', 'Desarmador punta de cruz número 2', NULL, 120, 30, 'Estante A2', 1, 'Latas', 'Unidad'),
('Casco de Seguridad Blanco', 'Casco de polietileno alta densidad', 'CS-2024-001', 450, 50, 'Estante B1', 2, 'Jugos', 'Serie'),
('Guantes de Carnaza', 'Guantes de carnaza reforzados', NULL, 85, 8, 'Estante B2', 2, 'Agua', 'Unidad'),
('Tornillo 1/2 pulgada', 'Tornillo de acero inoxidable', NULL, 2, 500, 'Caja C1', 3, 'Latas', 'Unidad');

-- 3. Insertar Movimientos (respetando tus ENUM: Entrada, Salida, Retorno)
INSERT INTO Movimientos (tipo, cantidad, descripcion_salida, observaciones, planta_movimiento, id_material, id_usuario) VALUES 
('Entrada', 10, 'Compra mensual de herramientas', 'Ingreso por proveedor', 'Agua', 1, 1),
('Salida', 2, 'Asignación a nuevo empleado', 'Entrega a Juan Pérez', 'Latas', 4, 1),
('Entrada', 200, 'Reabastecimiento de inventario', 'Ingreso por almacén central', 'Jugos', 5, 1);