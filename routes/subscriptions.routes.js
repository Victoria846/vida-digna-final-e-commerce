// src/routes/subscriptions.routes.js
const express = require("express");
const router = express.Router();

const subscriptionsController = require("../controllers/subscriptionsController");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");

/* ==========
 * PUBLIC
 * ========== */

// Listar planes activos
router.get("/plans", subscriptionsController.listActivePlans);

// Detalle de un plan (opcional)
router.get("/plans/:id", subscriptionsController.getPlanById);

/* ==========
 * CLIENTE AUTENTICADO
 * ========== */

// Ver suscripción actual del usuario
router.get("/me/current", authMiddleware, subscriptionsController.getMyCurrentSubscription);

// Crear / cambiar suscripción
router.post("/me/subscribe", authMiddleware, subscriptionsController.subscribeToPlan);

// Cancelar renovación automática
router.post("/me/cancel", authMiddleware, subscriptionsController.cancelMySubscription);

/* ==========
 * ADMIN
 * ========== */

// CRUD de planes
router.post("/admin/plans", authMiddleware, adminMiddleware, subscriptionsController.createPlan);

router.put("/admin/plans/:id", authMiddleware, adminMiddleware, subscriptionsController.updatePlan);

router.delete(
  "/admin/plans/:id",
  authMiddleware,
  adminMiddleware,
  subscriptionsController.deletePlan,
);

// Ver suscriptores de un plan
router.get(
  "/admin/plans/:id/subscribers",
  authMiddleware,
  adminMiddleware,
  subscriptionsController.listPlanSubscribers,
);

module.exports = router;
