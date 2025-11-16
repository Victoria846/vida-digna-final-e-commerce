require("dotenv").config();
const express = require("express");
const path = require("path");
const routes = require("./routes");
const db = require("./models"); // 👈 usa el mismo index de models

const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

// Disponibilizar sequelize y modelos
app.set("sequelize", db.sequelize);
app.set("models", db);

app.use(express.static("public"));
app.use(express.json());

routes(app);

app.listen(APP_PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexión a la base de datos OK");
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err.message);
  }

  console.log(`\n✅ Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`🔗 Accedé desde: http://localhost:${APP_PORT}\n`);
});
