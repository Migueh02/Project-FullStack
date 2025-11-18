# Sistema de Login y Registro

## ✅ Funcionalidades Implementadas

### Backend

1. **POST /api/auth/register** - Registro de nuevos usuarios
   - Valida formato de email
   - Valida longitud de contraseña (mínimo 6 caracteres)
   - Verifica que el email no esté duplicado
   - Retorna: `{ success: true, userId, email, message }`

2. **POST /api/auth/login** - Inicio de sesión
   - Valida credenciales
   - Retorna: `{ success: true, userId, email }`

### Frontend

1. **Página de Registro** (`/register`)
   - Formulario con validación
   - Confirmación de contraseña
   - Redirección automática después del registro

2. **Página de Login** (`/login`)
   - Formulario de autenticación
   - Manejo de errores
   - Redirección automática después del login

3. **Navbar Dinámico**
   - Muestra opciones de login/registro si no hay sesión
   - Muestra email del usuario y botón de logout si hay sesión
   - Se actualiza automáticamente según el estado de autenticación

4. **Protección de Rutas**
   - Las tareas solo se muestran si hay usuario logueado
   - Redirección automática al login si no hay sesión

## 🔐 Flujo de Autenticación

1. **Registro:**
   - Usuario completa formulario en `/register`
   - Se crea cuenta en la base de datos
   - Se guarda `userId` y `email` en `localStorage`
   - Redirección a página principal

2. **Login:**
   - Usuario completa formulario en `/login`
   - Se validan credenciales
   - Se guarda `userId` y `email` en `localStorage`
   - Redirección a página principal

3. **Uso de la Aplicación:**
   - El `userId` se usa automáticamente al crear tareas
   - Las tareas se filtran por `usuario_id`
   - Solo el usuario logueado ve sus propias tareas

4. **Logout:**
   - Se eliminan datos del `localStorage`
   - Redirección a página de login

## 📝 Notas Importantes

- Las contraseñas se almacenan en texto plano (solo para desarrollo)
- En producción, usar bcrypt para hashear contraseñas
- El `userId` se guarda en `localStorage` (considerar usar cookies o tokens JWT en producción)
- El sistema crea automáticamente un usuario de prueba (`test@example.com`) al inicializar la base de datos

## 🧪 Pruebas

### Crear un nuevo usuario:
```bash
POST http://localhost:4000/api/auth/register
Body: {
  "email": "usuario@example.com",
  "password": "password123"
}
```

### Iniciar sesión:
```bash
POST http://localhost:4000/api/auth/login
Body: {
  "email": "usuario@example.com",
  "password": "password123"
}
```

## 🚀 Próximos Pasos (Opcional)

- Implementar hash de contraseñas con bcrypt
- Agregar tokens JWT para autenticación más segura
- Implementar refresh tokens
- Agregar validación de sesión en el backend
- Implementar "Recordarme" con cookies persistentes

