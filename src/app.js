const express = require('express');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Redis usando la variable de entorno REDIS_URL
// Si no existe, usa 'redis://redis:6379' (el nombre del servicio en Docker Compose)
const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';
const redisClient = redis.createClient({ url: redisUrl });

redisClient.on('error', (err) => console.log('Redis Client Error', err));

// Middleware para manejar JSON (opcional, pero buena práctica)
app.use(express.json());

// 1. Endpoint principal: Título "Control de visitas"
app.get('/', (req, res) => {
    res.send('<h1>Control de visitas</h1><p>Bienvenido a MantStock - Módulo Node.js</p>');
});

// 2. Endpoint /health
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'activo', timestamp: new Date() });
});

// 3. Endpoint /api/visitas (Conectado a Redis)
app.get('/api/visitas', async (req, res) => {
    try {
        // Incrementa el contador en Redis
        const visitas = await redisClient.incr('contador_visitas');
        res.json({ 
            mensaje: 'Visita registrada', 
            total_visitas: visitas 
        });
    } catch (error) {
        // Manejo de error controlado si Redis no está disponible
        console.error('Error conectando a Redis:', error);
        res.status(500).json({ 
            error: 'Servicio de visitas no disponible', 
            detalle: 'No se pudo conectar a Redis' 
        });
    }
});

// Iniciar servidor
if (require.main === module) {
    redisClient.connect().then(() => {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor Node.js corriendo en http://0.0.0.0:${PORT}`);
        });
    });
}

// Exportamos app para las pruebas (test/app.test.js)
module.exports = app;