# Guía de Testing del Backend

Esta guía explica cómo ejecutar los tests del backend para verificar que todo funcione correctamente con Docker.

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Node.js (si quieres ejecutar tests localmente)

## 🚀 Ejecutar Tests con Docker

### Opción 1: Tests en Contenedor Docker (Recomendado)

1. **Construir y ejecutar los tests:**
   ```bash
   cd backend
   docker-compose -f docker-compose.test.yml up --build
   ```

2. **Ver los logs de los tests:**
   Los resultados de los tests se mostrarán en la consola del contenedor `backend-test`.

3. **Limpiar después de los tests:**
   ```bash
   docker-compose -f docker-compose.test.yml down -v
   ```

### Opción 2: Tests Locales (con Docker para la BD)

1. **Iniciar solo la base de datos:**
   ```bash
   cd backend
   docker-compose up db -d
   ```

2. **Configurar la base de datos:**
   ```bash
   npm run setup-db
   ```

3. **Ejecutar los tests:**
   ```bash
   npm test
   ```

4. **Ejecutar tests en modo watch:**
   ```bash
   npm run test:watch
   ```

5. **Ejecutar tests con cobertura:**
   ```bash
   npm run test:coverage
   ```

## 📝 Estructura de Tests

Los tests están organizados en la carpeta `backend/tests/`:

- **setup.test.js**: Tests de configuración y conexión a la base de datos
- **categorias.test.js**: Tests para endpoints de categorías (GET, POST)
- **auth.test.js**: Tests para endpoints de autenticación (POST /auth/login)
- **tareas.test.js**: Tests para endpoints de tareas con nuevas funcionalidades

## ✅ Tests Incluidos

### Tests de Configuración
- ✅ Conexión a la base de datos
- ✅ Verificación de tablas (tareas, categorias, usuarios)
- ✅ Verificación de columnas (categoria_id, usuarios_id)

### Tests de Categorías
- ✅ GET /api/categorias - Listar categorías
- ✅ POST /api/categorias - Crear categoría
- ✅ Validación de campos requeridos

### Tests de Autenticación
- ✅ POST /api/auth/login - Login exitoso
- ✅ POST /api/auth/login - Credenciales inválidas
- ✅ POST /api/auth/login - Validación de campos

### Tests de Tareas
- ✅ POST /api/tasks - Crear tarea con usuarios_id
- ✅ POST /api/tasks - Crear tarea con categoria_id
- ✅ POST /api/tasks - Validación de usuarios_id requerido
- ✅ GET /api/tasks?usuario_id=X - Filtrar por usuario
- ✅ GET /api/tasks?usuario_id=X&categoria_id=Y - Filtrar por categoría
- ✅ PUT /api/tasks/:id - Actualizar categoria_id
- ✅ Verificación de categoria_nombre en respuestas

## 🔧 Configuración de Variables de Entorno para Tests

Los tests usan las siguientes variables de entorno (configuradas automáticamente en Docker):

```env
DATABASE_URL=postgresql://postgres:postgres@db-test:5432/taskhub_db_test
NODE_ENV=test
```

## 🐛 Solución de Problemas

### Error: "No se pudo conectar a la base de datos"
- Verifica que el contenedor de PostgreSQL esté corriendo
- Espera unos segundos para que PostgreSQL esté completamente listo
- Verifica las variables de entorno en docker-compose

### Error: "Tabla no existe"
- Ejecuta el script de setup: `npm run setup-db`
- Verifica que el archivo `migrations.sql` exista

### Tests fallan intermitentemente
- Aumenta el timeout en `jest.config.js`
- Verifica que la base de datos esté completamente inicializada antes de los tests

## 📊 Cobertura de Tests

Para ver la cobertura de código:

```bash
npm run test:coverage
```

Esto generará un reporte en la carpeta `coverage/` mostrando qué líneas de código están cubiertas por los tests.

## 🔄 Integración Continua

Los tests pueden integrarse en CI/CD. Ejemplo para GitHub Actions:

```yaml
- name: Run tests
  run: |
    cd backend
    docker-compose -f docker-compose.test.yml up --build --abort-on-container-exit
```

## 📚 Notas Adicionales

- Los tests limpian los datos de prueba después de ejecutarse
- Cada suite de tests crea sus propios datos de prueba
- Los tests usan una base de datos separada (`taskhub_db_test`) para no afectar datos de desarrollo

