// jwt-test.js
require("dotenv").config(); // para leer .env
const { generateToken, verifyToken } = require("./helpers/jwt");

// Payload de prueba
const payload = { id: 1, email: "admin@test.com", role: "superadmin" };

// Generar token
const token = generateToken(payload);
console.log("Token generado:\n", token);

// Verificar token
const decoded = verifyToken(token);
console.log("\nToken decodificado:\n", decoded);
