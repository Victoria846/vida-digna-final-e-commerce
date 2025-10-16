require("dotenv").config();
const express = require("express");
const path = require("path");
const routes = require("./routes");
const APP_PORT = process.env.APP_PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(express.json());

routes(app);

app.listen(APP_PORT, () => {
  console.log(`\n✅ Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`🔗 Accedé desde: http://localhost:${APP_PORT}\n`);
});
