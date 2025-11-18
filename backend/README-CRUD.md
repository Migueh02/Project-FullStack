# CRUD Completo - Tareas y Categorías

## ✅ Funcionalidades Implementadas

### Backend - Categorías

1. **GET /api/categorias** - Listar todas las categorías
2. **POST /api/categorias** - Crear nueva categoría
3. **PUT /api/categorias/:id** - Actualizar categoría
4. **DELETE /api/categorias/:id** - Eliminar categoría
   - Valida que no haya tareas usando la categoría antes de eliminar

### Backend - Tareas

1. **GET /api/tasks?usuario_id=X&categoria_id=Y** - Listar tareas (con filtros)
2. **POST /api/tasks** - Crear nueva tarea
3. **PUT /api/tasks/:id** - Actualizar tarea
4. **DELETE /api/tasks/:id** - Eliminar tarea

### Frontend - Categorías

**Página: `/categorias`**

- ✅ Formulario para crear categorías
- ✅ Listado de todas las categorías con colores
- ✅ Botón "Editar" en cada categoría (edición inline)
- ✅ Botón "Eliminar" en cada categoría (con confirmación)
- ✅ Validación antes de eliminar (verifica si hay tareas usando la categoría)

### Frontend - Tareas

**Página: `/` (Home)**

- ✅ Listado de tareas del usuario logueado
- ✅ Filtro por categoría
- ✅ Botón "Editar" en cada tarea (edición inline)
- ✅ Botón "Eliminar" en cada tarea (con confirmación)
- ✅ Al editar, se puede cambiar título, descripción y categoría
- ✅ Colores según categoría (Estudio=amarillo, Trabajo=verde, Hobby=azul)

## 🎨 Características de la UI

### Edición Inline
- Al hacer clic en "Editar", el formulario aparece directamente en la tarjeta
- Campos editables: título, descripción y categoría
- Botones "Guardar" y "Cancelar"

### Confirmación de Eliminación
- Antes de eliminar, se muestra un diálogo de confirmación
- Mensajes de error claros si la operación falla

### Validaciones
- **Categorías:** No se pueden eliminar si hay tareas usándolas
- **Tareas:** Requieren título para crear/actualizar
- **Formularios:** Validación en tiempo real

## 📝 Ejemplos de Uso

### Crear Categoría
```javascript
POST /api/categorias
Body: { "nombre": "Personal" }
```

### Actualizar Categoría
```javascript
PUT /api/categorias/1
Body: { "nombre": "Estudio Actualizado" }
```

### Eliminar Categoría
```javascript
DELETE /api/categorias/1
// Retorna error si hay tareas usando esta categoría
```

### Crear Tarea
```javascript
POST /api/tasks
Body: {
  "titulo": "Estudiar React",
  "descripcion": "Aprender hooks",
  "categoria_id": 1,
  "usuarios_id": 1
}
```

### Actualizar Tarea
```javascript
PUT /api/tasks/1
Body: {
  "titulo": "Título actualizado",
  "descripcion": "Nueva descripción",
  "categoria_id": 2
}
```

### Eliminar Tarea
```javascript
DELETE /api/tasks/1
```

## 🔒 Seguridad

- Las tareas solo se muestran/editan/eliminan para el usuario logueado
- Validación de `usuarios_id` en todas las operaciones de tareas
- No se pueden eliminar categorías que están en uso

## 🚀 Próximos Pasos (Opcional)

- Agregar estado de completado a las tareas
- Agregar fechas de vencimiento
- Implementar búsqueda de tareas
- Agregar ordenamiento (por fecha, categoría, etc.)
- Implementar drag & drop para reordenar

