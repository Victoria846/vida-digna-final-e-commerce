// src/routes/users.routes.js
const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

/* ==========
 * AUTH
 * ========== */

router.post("/auth/register", usersController.register);
router.post("/auth/login", usersController.login);

/* ==========
 * PERFIL DEL USUARIO
 * ========== */

router.get("/me", authMiddleware, usersController.getMe);
router.put("/me", authMiddleware, usersController.updateMe);

/* ==========
 * ADMIN - USERS
 * ========== */

router.get("/admin", authMiddleware, adminMiddleware, usersController.listUsers);

router.get("/admin/:id", authMiddleware, adminMiddleware, usersController.getUserById);

router.put("/admin/:id", authMiddleware, adminMiddleware, usersController.updateUserByAdmin);

router.delete("/admin/:id", authMiddleware, adminMiddleware, usersController.deleteUser);

module.exports = router;
