const express = require("express");
const router = express.Router();

// TODO: crear estos controllers
const storeController = require("../controllers/storeController");
const orderController = require("../controllers/orderController");

// TODO: implementar estos middlewares
const { authMiddleware, adminMiddleware } = require("../middlewares/auth");
const { upload } = require("../middlewares/uploadImage");

/* ==========
 * PUBLIC - STORE
 * ========== */

// Listar productos (con filtros opcionales ?category=slug, ?status=active, etc.)
router.get("/products", storeController.listProducts);

// Obtener detalle de un producto
router.get("/products/:id", storeController.getProductById);

// Listar categorías
router.get("/categories", storeController.listCategories);

// Obtener productos por categoría
router.get("/categories/:slug/products", storeController.listProductsByCategorySlug);

/* ==========
 * CLIENTE AUTENTICADO - ORDERS
 * ========== */

// Listar órdenes del usuario logueado
router.get("/me/orders", authMiddleware, orderController.listMyOrders);

// Obtener detalle de una orden del usuario logueado
router.get("/me/orders/:id", authMiddleware, orderController.getMyOrderById);

// Crear nueva orden (checkout)
router.post("/orders", authMiddleware, orderController.createOrderFromPayload);

/* ==========
 * ADMIN - STORE
 * ========== */

// CRUD de productos
router.post(
  "/admin/products",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  storeController.createProduct,
);

router.put("/admin/products/:id", authMiddleware, adminMiddleware, storeController.updateProduct);

router.delete(
  "/admin/products/:id",
  authMiddleware,
  adminMiddleware,
  storeController.deleteProduct,
);

// CRUD de categorías
router.post("/admin/categories", authMiddleware, adminMiddleware, storeController.createCategory);

router.put(
  "/admin/categories/:id",
  authMiddleware,
  adminMiddleware,
  storeController.updateCategory,
);

router.delete(
  "/admin/categories/:id",
  authMiddleware,
  adminMiddleware,
  storeController.deleteCategory,
);

// Listar órdenes (admin)
router.get("/admin/orders", authMiddleware, adminMiddleware, orderController.listAllOrders);

router.get("/admin/orders/:id", authMiddleware, adminMiddleware, orderController.getOrderById);

module.exports = router;
