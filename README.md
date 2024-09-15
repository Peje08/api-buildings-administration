## API Template Node.js con MongoDB

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

Este proyecto es una plantilla de API construida con Node.js y MongoDB, que incluye ejemplos de modelos, controladores y rutas para los recursos User y Post. También está configurado para ejecutarse en contenedores Docker, lo que facilita su despliegue y ejecución.


### Folder Structure Convention

```
.
├── src
│   ├── controllers
│   │   └── index.js
│   ├── models
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes
│   │   └── index.js
│   ├── db.js
│   ├── express.js
│   ├── swagger.yaml
│   └── app.js
├── .env
├── .gitignore
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

- src/controllers: Controladores que manejan la lógica de las solicitudes.
- src/models: Modelos de Mongoose para User y Post.
- src/routes: Definición de las rutas de la API.
- src/db.js: Configuración y conexión a la base de datos.
- src/express.js: Configuración de Express y middlewares.
- src/swagger.yaml: Definición de la documentación de la API en Swagger.
- app.js: Punto de entrada de la aplicación.
- Dockerfile: Configuración para crear la imagen Docker de la aplicación.
- docker-compose.yml: Configuración para levantar la aplicación y MongoDB con Docker Compose.

### Instalación

#### Clonar el repositorio

```bash
git clone https://github.com/codexar-latam/api-nodejs-template.git
cd api-nodejs-template
```
#### Variables de entorno

Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables:

```
MONGODB_URI=mongodb://mongo:27017/tu_base_de_datos
PORT=4000
```

- `MONGODB_URI`: La URI de conexión a tu base de datos MongoDB. Cuando uses Docker, apunta al servicio mongo definido en docker-compose.yml.

- `PORT`: El puerto en el que se ejecutará la aplicación.

### Ejecutar la aplicación

#### Ejecutar con Docker

**Paso 1: Asegúrate de tener Docker Desktop instalado y en ejecución**

- Descarga e instala Docker Desktop desde la página oficial: Docker Desktop.

- Inicia Docker Desktop y verifica que esté en ejecución antes de continuar.

**Paso 2: Construir y levantar los contenedores**

Ejecuta el siguiente comando en la raíz de tu proyecto:

```bash
docker-compose up --build
```

Este comando:
- Construye las imágenes de Docker según el Dockerfile.
- Levanta los servicios definidos en docker-compose.yml:
    - app: Tu aplicación Node.js.
    - mongo: Una instancia de MongoDB.

**Paso 3: Verificar que los contenedores están en ejecución**

- En la terminal, deberías ver logs tanto de la aplicación como de MongoDB.

- Para verificar los contenedores en ejecución, abre otra terminal y ejecuta:

```bash
docker-compose ps
```

**Paso 4: Acceder a la aplicación**

- Abre tu navegador y visita `http://localhost:4000`

- Deberías ver un mensaje de bienvenida de la API.

