require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors"); // 👈 IMPORTANTE
const routes = require("./routes");
const db = require("./models");

const APP_PORT = process.env.APP_PORT || 3000;
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";

const allowedOrigins = [
  FRONT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
];

const app = express();

/* =============================
 *  CORS CONFIG
 * ============================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // origin puede ser undefined en herramientas tipo Postman
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("❌ CORS bloqueado para origen:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

/* =============================
 * EXPRESS CONFIG
 * ============================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* =============================
 * DB + MODELOS
 * ============================= */
app.set("sequelize", db.sequelize);
app.set("models", db);

/* =============================
 * HOME PAGE (opcional)
 * ============================= */
app.get("/", (req, res) => {
  res.send(`
    <h1>🌱 API de Vida Digna corriendo</h1>
    <p>Servidor OK en el puerto ${APP_PORT}</p>
    <p>Podes probar endpoints como <code>/api/store/products</code> o <code>/api/content/blog</code>.</p>
  `);
});

/* =============================
 * RUTAS
 * ============================= */
routes(app);

/* =============================
 * START SERVER
 * ============================= */
app.listen(APP_PORT, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Conexión a la base de datos OK");
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err.message);
  }

  console.log(`\n✅ Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`🔗 Accedé desde: http://localhost:${APP_PORT}`);
  console.log(`🔗 Front habilitado por CORS: ${FRONT_URL}\n`);
});
