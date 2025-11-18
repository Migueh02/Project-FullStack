# 🧪 Sistema de Tests del Backend

## Resumen

Se ha implementado un sistema completo de tests para verificar que el backend funcione correctamente con Docker. Los tests cubren todas las nuevas funcionalidades implementadas.

## 📦 Archivos Creados

### Tests
- `tests/setup.test.js` - Tests de configuración y conexión
- `tests/categorias.test.js` - Tests de endpoints de categorías
- `tests/auth.test.js` - Tests de autenticación
- `tests/tareas.test.js` - Tests de tareas con nuevas funcionalidades

### Scripts
- `scripts/setupDatabase.js` - Script para inicializar la base de datos
- `scripts/quick-test.sh` - Script rápido para ejecutar tests
- `scripts/init-db.sh` - Script de inicialización para Docker

### Configuración
- `jest.config.js` - Configuración de Jest
- `docker-compose.test.yml` - Docker Compose para tests
- `.dockerignore` - Archivos a ignorar en Docker

### Documentación
- `TESTING.md` - Guía completa de testing
- `README-TESTS.md` - Este archivo

## 🚀 Cómo Ejecutar los Tests

### Opción 1: Con Docker (Recomendado)
```bash
cd backend
docker-compose -f docker-compose.test.yml up --build
```

### Opción 2: Localmente
```bash
cd backend
# Asegúrate de que PostgreSQL esté corriendo
npm run setup-db
npm test
```

## ✅ Tests Implementados

### 1. Tests de Configuración (`setup.test.js`)
- ✅ Conexión a PostgreSQL
- ✅ Verificación de tabla `tareas`
- ✅ Verificación de tabla `categorias`
- ✅ Verificación de tabla `usuarios`
- ✅ Verificación de columnas `categoria_id` y `usuarios_id`

### 2. Tests de Categorías (`categorias.test.js`)
- ✅ GET /api/categorias - Listar categorías
- ✅ POST /api/categorias - Crear categoría
- ✅ Validación de campos requeridos
- ✅ Rechazo de categorías sin nombre

### 3. Tests de Autenticación (`auth.test.js`)
- ✅ POST /api/auth/login - Login exitoso
- ✅ POST /api/auth/login - Credenciales inválidas
- ✅ POST /api/auth/login - Email inexistente
- ✅ Validación de campos requeridos

### 4. Tests de Tareas (`tareas.test.js`)
- ✅ POST /api/tasks - Crear tarea con usuarios_id
- ✅ POST /api/tasks - Crear tarea con categoria_id
- ✅ POST /api/tasks - Validación de usuarios_id requerido
- ✅ GET /api/tasks?usuario_id=X - Filtrar por usuario
- ✅ GET /api/tasks?usuario_id=X&categoria_id=Y - Filtrar por categoría
- ✅ PUT /api/tasks/:id - Actualizar categoria_id
- ✅ Verificación de categoria_nombre en respuestas

## 🔧 Mejoras en Docker

### docker-compose.yml
- ✅ Healthcheck para PostgreSQL
- ✅ Inicialización automática de base de datos
- ✅ Dependencias correctas entre servicios

### docker-compose.test.yml
- ✅ Base de datos separada para tests
- ✅ Ejecución automática de migraciones
- ✅ Ejecución automática de tests

## 📊 Cobertura

Para ver la cobertura de código:
```bash
npm run test:coverage
```

## 🐛 Solución de Problemas

Si los tests fallan:

1. **Verifica que Docker esté corriendo:**
   ```bash
   docker ps
   ```

2. **Verifica que la base de datos esté configurada:**
   ```bash
   npm run setup-db
   ```

3. **Limpia y reconstruye los contenedores:**
   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

4. **Revisa los logs:**
   ```bash
   docker-compose logs backend
   ```

## 📝 Notas Importantes

- Los tests usan una base de datos de prueba separada
- Cada suite de tests limpia sus datos después de ejecutarse
- El script `setupDatabase.js` espera a que PostgreSQL esté listo antes de ejecutar migraciones
- Las migraciones se ejecutan automáticamente al iniciar el contenedor

## 🎯 Próximos Pasos

1. Ejecutar los tests para verificar que todo funciona
2. Revisar la cobertura de código
3. Agregar más tests según sea necesario
4. Integrar en CI/CD si es necesario

