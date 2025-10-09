const { verifyToken } = require("../helpers/jwt");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No se proporcionó token de autenticación" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  if (!decoded) {
    return res.status(401).json({ error: "Token de autenticación inválido o expirado" });
  }

  req.user = decoded;

  next();
}

module.exports = authMiddleware;
