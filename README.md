## API Buildings Administration

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

La API de Administración de Edificios es un servicio RESTful diseñado para gestionar usuarios, direcciones y documentos para administraciones de consorcios de edificios. Permite a los administradores realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en diversas entidades, asegurando una gestión eficiente de los consorcios de edificios.


### Folder Structure Convention

```
.
├── src
│   ├── controllers
│   │   └── index.controller.js
│   │   └── address.controller.js
│   │   └── document.controller.js
│   │   └── user.controller.js
│   ├── models
│   │   ├── Address.js
│   │   └── Document.js
│   │   └── User.js
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
git clone https://github.com/Peje08/api-buildings-administration
cd api-buildings-administration
```

#### Instalar dependencias

```bash     
npm install
```
#### Variables de entorno

Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables:

```
MONGODB_URI=mongodb://mongo:27017/buildings_admnisitration
PORT=4000
```

- `MONGODB_URI`: La URI de conexión a tu base de datos MongoDB. Cuando uses Docker, apunta al servicio mongo definido en docker-compose.yml.

- `PORT`: El puerto en el que se ejecutará la aplicación.

### Ejecutar la aplicación

### Ejecutar localmente

```bash
npm run dev
```

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

- Abre tu navegador y visita `http://localhost:4000/api`

- Deberías ver un mensaje de bienvenida de la API.

### Endpoints de la API

#### Domicilios

Gestiona las direcciones asociadas a usuarios.

- GET `/addresses`
- GET `/addresses:id`
- POST `/addresses`
- PUT `/addresses/:id`
- DELETE `/addresses/:id`

#### Documentos

Gestiona los documentos asociados a usuarios.

- GET `/documents`
- GET `/documents:id`
- POST `/documents`
- PUT `/documents/:id`
- DELETE `/documents/:id`

#### Usuarios

Gestiona los usuarios de la aplicación.

- GET `/users`
- GET `/users:id`
- POST `/users`
- PUT `/users/:id`
- DELETE `/users/:id`


