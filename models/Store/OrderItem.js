const { Model, DataTypes } = require("sequelize");

class OrderItem extends Model {
  static initModel(sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        order_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "orders",
            key: "id",
          },
        },
        product_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "products",
            key: "id",
          },
        },
        quantity: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 1,
          validate: {
            min: { args: [1], msg: "La cantidad mínima es 1" },
          },
        },
        unit_price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: { msg: "El precio unitario debe ser un número válido" },
            min: { args: [0], msg: "El precio unitario no puede ser negativo" },
          },
        },
        subtotal: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: { msg: "El subtotal debe ser un número válido" },
            min: { args: [0], msg: "El subtotal no puede ser negativo" },
          },
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items",
        timestamps: true,
        underscored: true,
      },
    );

    return OrderItem;
  }
}

module.exports = OrderItem;
