const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: true, // ponelo en false si querés obligar login
          references: {
            model: "users",
            key: "id",
          },
        },
        status: {
          type: DataTypes.ENUM(
            "pending", // creado, esperando pago
            "paid", // pagado
            "cancelled", // cancelado
            "shipped", // enviado (si aplica)
            "completed", // entregado / finalizado
          ),
          allowNull: false,
          defaultValue: "pending",
          validate: {
            isIn: {
              args: [["pending", "paid", "cancelled", "shipped", "completed"]],
              msg: "Estado de orden inválido",
            },
          },
        },
        total_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: { msg: "El total debe ser un número válido" },
            min: { args: [0], msg: "El total no puede ser negativo" },
          },
        },
        currency: {
          type: DataTypes.STRING(3),
          allowNull: false,
          defaultValue: "USD", // cambiá a "UYU" si preferís
          validate: {
            notEmpty: { msg: "La moneda no puede estar vacía" },
            len: {
              args: [3, 3],
              msg: "La moneda debe ser un código ISO de 3 letras (ej: USD, UYU)",
            },
          },
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
        underscored: true,
      },
    );

    return Order;
  }
}

module.exports = Order;
