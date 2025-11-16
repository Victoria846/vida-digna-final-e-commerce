// src/routes/services.routes.js
const express = require("express");
const router = express.Router();

const servicesController = require("../controllers/servicesController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

/* ==========
 * PUBLIC
 * ========== */

// Listar servicios activos (cursos/talleres)
router.get("/", servicesController.listPublicServices);

// Detalle de un servicio
router.get("/:id", servicesController.getServiceById);

/* ==========
 * CLIENTE AUTENTICADO
 * ========== */

// Inscribirse a un servicio
router.post("/:id/enroll", authMiddleware, servicesController.enrollInService);

// Listar inscripciones del usuario
router.get("/me/enrollments", authMiddleware, servicesController.listMyEnrollments);

/* ==========
 * ADMIN
 * ========== */

// Crear servicio
router.post("/admin", authMiddleware, adminMiddleware, servicesController.createService);

// Actualizar servicio
router.put("/admin/:id", authMiddleware, adminMiddleware, servicesController.updateService);

// Eliminar (o marcar como inactive) servicio
router.delete("/admin/:id", authMiddleware, adminMiddleware, servicesController.deleteService);

// Ver inscripciones a un servicio
router.get(
  "/admin/:id/enrollments",
  authMiddleware,
  adminMiddleware,
  servicesController.listServiceEnrollments,
);

module.exports = router;
