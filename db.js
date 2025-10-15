const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "mi_base_de_datos",
});

db.connect((err) => {
  if (err) {
    console.error("Error en la conexión a la BD:", err);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

module.exports = db;
