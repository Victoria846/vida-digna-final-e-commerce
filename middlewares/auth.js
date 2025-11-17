// middlewares/auth.js (o donde lo tengas)
const { verifyToken } = require("../helpers/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  next();
}

function adminMiddleware(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  // 👈 Solo dejamos admin (porque el modelo no acepta superadmin)
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  next();
}

module.exports = {
  authMiddleware,
  adminMiddleware,
};
