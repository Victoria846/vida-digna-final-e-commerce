1. **_Controllers_**

Contiene la lógica de los endpoints.

Cada archivo representa un recurso (ej. userController.js para usuarios).

Aquí se definen las funciones que reciben la petición, procesan la información y devuelven la respuesta.

2. **_Models_**

Contiene los modelos de Sequelize.

Cada archivo representa una tabla de la base de datos (ej. user.js).

Aquí se definen los campos, tipos de datos y relaciones entre tablas.

3. **_Routes_**

Contiene las rutas de la API.

Cada archivo define los endpoints y a qué función del controller se conectan.

Ejemplo: GET /api/users llama a getAllUsers en el controller.

4. **_Middlewares_**

Contiene funciones que se ejecutan antes de los controllers.

Ejemplo: autenticación, validación de datos o logging de peticiones.

Se usan para agregar lógica intermedia antes de manejar la petición.

5. **_Seeders_**

Contiene datos iniciales para la base de datos.

Ejemplo: crear usuarios de prueba o productos iniciales.

Permite poblar la DB de forma automática para desarrollo o pruebas.

6. **_Utils_**

Contiene funciones auxiliares que se usan en varias partes del proyecto.

Ejemplo: un logger de errores o funciones de ayuda para formatear datos.

7. **_Config_**

Contiene configuraciones generales.

Ejemplo: db.js para configurar Sequelize y la conexión a MySQL.
**En nuestro caso la configuracion del sequalize y MySQL van en el archivo index.js**

Aquí se centralizan variables de entorno y ajustes de la app.

8. **_createDatabaseTable.js_**

Script para crear la base de datos o tablas sin necesidad de usar la terminal manualmente.

9. **_server.js_**

Archivo principal para arrancar la aplicación.

Configura Express, middlewares, rutas y conecta la base de datos.

10. **_Archivos de configuración_**

.env → Variables de entorno (DB, puerto, etc.).

.gitignore → Archivos y carpetas que Git debe ignorar.

.prettierrc → Configuración de formato de código.

nodemon.json → Configuración de reinicio automático con nodemon.
