function checkAdminRole(roles = []) {
  return (req, res, next) => {
    const userRole = req.user?.role; // cuando tengas login, esto viene del token
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
    }
    next();
  };
}

module.exports = checkAdminRole;
