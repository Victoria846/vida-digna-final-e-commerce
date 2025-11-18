// helpers/jwt.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function generateToken(payload) {
  // 👇 para debug, opcional:
  // console.log("[generateToken] Usando JWT_SECRET:", JWT_SECRET);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  try {
    // 👇 para debug, opcional:
    // console.log("[verifyToken] Usando JWT_SECRET:", JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("[verifyToken] Error verificando token:", error.message);
    return null;
  }
}

module.exports = { generateToken, verifyToken };
