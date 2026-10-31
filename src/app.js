const express = require('express');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Redis
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = redis.createClient({ url: redisUrl });

// Manejo de errores de Redis (Evita que la app se caiga)
redisClient.on('error', (err) => {
    console.error('⚠️ Error de conexión a Redis:', err.message);
});

// Middleware
app.use(express.json());

// 1. Endpoint principal
app.get('/', (req, res) => {
    res.send('<h1>Control de visitas</h1><p>Bienvenido a MantStock - Módulo Node.js</p>');
});

// 2. Endpoint /health
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'activo', timestamp: new Date() });
});

// 3. Endpoint /api/visitas
app.get('/api/visitas', async (req, res) => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect(); // Intenta conectar si no está abierto
        }
        const visitas = await redisClient.incr('contador_visitas');
        res.json({ 
            mensaje: 'Visita registrada', 
            total_visitas: visitas 
        });
    } catch (error) {
        console.error('Error en /api/visitas:', error.message);
        res.status(500).json({ 
            error: 'Servicio de visitas no disponible', 
            detalle: 'No se pudo conectar a Redis' 
        });
    }
});

// Iniciar servidor
if (require.main === module) {
    // Intentamos conectar a Redis en segundo plano, pero SIN bloquear el arranque del servidor
    redisClient.connect().catch((err) => {
        console.error('⚠️ Alerta: No se pudo conectar a Redis al inicio:', err.message);
    });

    // Levantamos el servidor SIEMPRE
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor Node.js corriendo en http://0.0.0.0:${PORT}`);
    });
}

module.exports = app;