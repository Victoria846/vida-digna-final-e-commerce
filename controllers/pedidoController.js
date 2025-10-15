const Pedido = require("./models/pedidoModel");

exports.crearPedido = (req, res) => {
  const nuevoPedido = req.body;
  Pedido.crear(nuevoPedido, (err, resultado) => {
    if (err) {
      return res.status(500).json({ error: "Error al crear el pedido" });
    }
    res.status(201).json({ mensaje: "Pedido creado", id: resultado.insertId });
  });
};

exports.listarPedidos = (req, res) => {
  Pedido.listarTodos((err, resultados) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener pedidos" });
    }
    res.status(200).json(resultados);
  });
};
