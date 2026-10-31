# 1. Imagen base: Node.js versión 20 en Alpine (ligera y segura)
FROM node:20-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos solo los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package*.json ./

# 4. Instalamos dependencias de producción (sin las de desarrollo)
RUN npm ci --omit=dev

# 5. Copiamos el resto del código fuente (solo la carpeta src)
COPY src ./src

# 6. Variables de entorno y puerto
ENV PORT=3000
EXPOSE 3000

# 7. Comando para iniciar la aplicación
CMD ["node", "src/app.js"]