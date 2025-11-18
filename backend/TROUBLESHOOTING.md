# Solución de Problemas del Backend

## Problema: El servidor no se inicia en localhost:4000

### Diagnóstico

Si el servidor no responde en `http://localhost:4000`, verifica lo siguiente:

1. **Verificar que los contenedores estén corriendo:**
   ```bash
   docker-compose ps
   ```

2. **Ver los logs del backend:**
   ```bash
   docker logs backend_taskhub
   ```

3. **Verificar que el puerto esté abierto:**
   ```bash
   # En Windows PowerShell
   Test-NetConnection -ComputerName localhost -Port 4000
   ```

### Solución Manual

Si el servidor no se inicia automáticamente, puedes iniciarlo manualmente:

```bash
# Entrar al contenedor
docker exec -it backend_taskhub sh

# Dentro del contenedor, ejecutar:
npm start
```

### Verificar el Estado

1. El setup de la base de datos debe completarse exitosamente
2. Debes ver el mensaje: "Servidor escuchando en puerto http://localhost:4000"
3. El puerto 4000 debe estar abierto y escuchando

### Comandos Útiles

```bash
# Reiniciar el contenedor
docker restart backend_taskhub

# Ver logs en tiempo real
docker logs -f backend_taskhub

# Reconstruir y reiniciar
docker-compose down
docker-compose up -d --build
```

