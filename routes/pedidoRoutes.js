const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedidoController");

router.post("/pedidos", pedidoController.crearPedido);
router.get("/pedidos", pedidoController.listarPedidos);

module.exports = router;
