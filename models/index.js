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
const Order = require("./Order");
const Product = require("./Product");
const Admin = require("./Admin");

// Inicializar todos los modelos
User.initModel(sequelize);
Order.initModel(sequelize);
Product.initModel(sequelize);
Admin.initModel(sequelize);

// Definir las asociaciones entre los modelos (si las hay)
User.hasMany(Order);
Order.belongsTo(User);

// Pedido.associate({ ItemPedido }); // Pedido tiene muchos items
// ItemPedido.associate({ Pedido }); // Item pertenece a Pedido

// 👇 Paso 5: Sincronizar la base de datos (solo en desarrollo)

// Exportar todo
module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Admin,
};
