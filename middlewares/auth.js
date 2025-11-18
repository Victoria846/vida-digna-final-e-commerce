// middlewares/auth.js (o donde lo tengas)
const { verifyToken } = require("../helpers/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  console.log("[authMiddleware] Authorization header:", authHeader);

  // Esperamos "Authorization: Bearer <token>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  console.log("[authMiddleware] Token extraído:", token);

  if (!token) {
    console.log("[authMiddleware] No se encontró token, devolviendo 401 (Token no proporcionado)");
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const decoded = verifyToken(token);
  console.log("[authMiddleware] Decoded token:", decoded);

  if (!decoded) {
    console.log("[authMiddleware] Token inválido o expirado, devolviendo 401");
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  req.user = {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };

  console.log("[authMiddleware] Usuario autenticado:", req.user);
  next();
}

function adminMiddleware(req, res, next) {
  console.log("[adminMiddleware] req.user:", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "No autenticado" });
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    console.log("[adminMiddleware] Acceso denegado. Rol:", req.user.role);
    return res.status(403).json({ message: "Acceso denegado" });
  }

  console.log("[adminMiddleware] Acceso permitido para rol:", req.user.role);
  next();
}

module.exports = {
  authMiddleware,
  adminMiddleware,
};
