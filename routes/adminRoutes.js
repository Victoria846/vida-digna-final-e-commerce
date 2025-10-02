const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const checkAdminRole = require("../middlewares/checkAdminRole");

router.get("/", adminController.index);
router.post("/", checkAdminRole(["admin", "superadmin"]), adminController.store);
router.get("/:id", adminController.show);
router.patch("/:id", adminController.update);
router.delete("/:id", checkAdminRole(["superadmin"]), adminController.destroy);

module.exports = router;
