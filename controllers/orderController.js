const Order = require("../models/Order");

exports.crearPedido = (req, res) => {
  const newOrder = req.body;
  Order.create(newOrder, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al crear el pedido" });
    }
    res.status(201).json({ mensaje: "Pedido creado", id: result.insertId });
  });
};

exports.listOrder = (req, res) => {
  Order.listOrder((err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener pedidos" });
    }
    res.status(200).json(result);
  });
};
