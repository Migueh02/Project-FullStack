# TaskHub - Aplicación Full Stack de Gestión de Tareas

Una aplicación web full stack para gestión de tareas construida con Node.js, Express, PostgreSQL y React.

## 📋 Estructura del Proyecto

```
Project-FullStack/
├── backend/                 # Servidor Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuración de la base de datos
│   │   ├── controller/     # Controladores de la API
│   │   └── routes/        # Rutas de la API
│   ├── app.js             # Entrada principal del servidor
│   ├── Dockerfile         # Configuración de Docker para el backend
│   └── docker-compose.yml # Configuración de servicios (PostgreSQL + Backend)
│
└── frontend/              # Cliente React (próximamente)
```

## 🚀 Tecnologías Utilizadas

- **Backend:**
  - Node.js
  - Express
  - PostgreSQL
  - Docker
  - Docker Compose

- **Frontend (En desarrollo):**
  - React (próximamente)

## ⚙️ Requisitos Previos

- Node.js >= 18
- Docker y Docker Compose
- PostgreSQL (si se ejecuta sin Docker)

## 🛠️ Configuración del Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Migueh02/Project-FullStack.git
   cd Project-FullStack
   ```

2. **Configurar el Backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Crear un archivo `.env` en la carpeta `backend` con:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@db:5432/taskhub_db
   NODE_ENV=development
   PORT=4000
   ```

## 🚀 Ejecutar el Proyecto

### Usando Docker (Recomendado):

1. **Iniciar los servicios:**
   ```bash
   cd backend
   docker-compose up --build
   ```

Los servicios estarán disponibles en:
- API Backend: http://localhost:4000
- pgAdmin: http://localhost:5050
  - Email: admin@gmail.com
  - Password: admin

### Sin Docker:

1. **Configurar PostgreSQL:**
   - Crear base de datos `taskhub_db`
   - Ejecutar el script SQL para crear la tabla:
     ```sql
     CREATE TABLE tareas (
       id SERIAL PRIMARY KEY,
       titulo VARCHAR(100) NOT NULL,
       descripcion TEXT
     );
     ```

2. **Iniciar el Backend:**
   ```bash
   cd backend
   npm start
   ```

## 📡 API Endpoints

- **GET /api/tasks**
  - Lista todas las tareas
  - Response: Array de tareas

- **POST /api/tasks**
  - Crea una nueva tarea
  - Body: `{ "titulo": "string", "descripcion": "string" }`

- **PUT /api/tasks/:id**
  - Actualiza una tarea existente
  - Body: `{ "titulo": "string", "descripcion": "string" }`

- **DELETE /api/tasks/:id**
  - Elimina una tarea

## 🧪 Testing

Puedes probar los endpoints usando Postman o cURL:

```bash
# Listar tareas
curl http://localhost:4000/api/tasks

# Crear tarea
curl -X POST http://localhost:4000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Nueva Tarea","descripcion":"Descripción de la tarea"}'
```

## 📝 Desarrollo

1. El backend está configurado con nodemon para auto-recarga
2. Los cambios en el código se aplican automáticamente
3. Los logs de la aplicación están disponibles en la consola de Docker

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: alguna característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
