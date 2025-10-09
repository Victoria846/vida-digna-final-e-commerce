const { Sequelize } = require("sequelize");

// Crear la instancia de Sequelize
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_CONNECTION,
    logging: false,
  },
);

// Requerir todos los modelos
const User = require("./User");
const Article = require("./Article");
const Pedido = require("./Pedido"); // nuevo
const ItemPedido = require("./ItemPedido"); // nuevo

// Inicializar todos los modelos
User.initModel(sequelize);
Article.initModel(sequelize);
Pedido.initModel(sequelize); // nuevo
ItemPedido.initModel(sequelize); // nuevo

// Establecer relaciones
// Pedido.associate({ ItemPedido }); // Pedido tiene muchos items
// ItemPedido.associate({ Pedido }); // Item pertenece a Pedido

// 👇 Paso 5: Sincronizar la base de datos (solo en desarrollo)
sequelize
  .sync({ force: true }) // cuidado con alter en producción
  .then(() => {
    console.log("✅ Base de datos sincronizada con éxito.");
  })
  .catch((err) => {
    console.error("❌ Error al sincronizar la base de datos:", err);
  });

// Exportar todo
module.exports = {
  sequelize,
  User,
  Article,
  Pedido,
  ItemPedido,
};
