const { verifyToken } = require("../helpers/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // Esperamos "Authorization: Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  // Lo que guardamos en el token lo usamos acá
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

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({ message: "Acceso denegado" });
  }

  next();
}

module.exports = {
  authMiddleware,
  adminMiddleware,
};
