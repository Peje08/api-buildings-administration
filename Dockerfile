# Usamos una imagen base de Node.js 18
FROM node:18

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto de la aplicación
COPY . .

# Exponemos el puerto (asegúrate de que coincide con el puerto que utiliza tu aplicación)
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]