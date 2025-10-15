const db = require("../db");

const Pedido = {
  crear: (pedidoData, callback) => {
    const { cliente, total } = pedidoData;
    const query = "INSERT INTO pedidos (cliente, total) VALUES (?, ?)";
    db.query(query, [cliente, total], callback);
  },

  listarTodos: (callback) => {
    db.query("SELECT * FROM pedidos", callback);
  },
};

module.exports = Pedido;
