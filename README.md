# Proyecto Integrador 2
## UNTREF Backend - Argentina Programa 4.0

### TODO:
- Preparar .env con tu cadena de conexión
- Instalar los módulos de node.js
  ```
    npm install
  ```
- Iniciar el servidor
  ```
    npm run start
  ```
- Correr las pruebas (en otra terminal)
  ```
    npm run test
  ```
- Detener el servidor (en otra terminal)
  ```
    npm run stop
  ```
---
### Dependencias Node.js
1. dotenv > 16.3.1
2. express > 4.18.2
3. mongodb > 5.6.0
---
### Especificaciones del servidor
- Servidor: http://127.0.0.1:3005
- Endpoints:
  - GET - /api/v1/muebles - OPCIONALES (Query): categoria, precio_gte, precio_lte
  - GET - /api/v1/muebles/:codigo
  - POST - /api/v1/muebles
  - PUT - /api/v1/muebles/:codigo
  - DELETE - /api/v1/muebles/:codigo
---
