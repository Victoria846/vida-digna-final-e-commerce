const { DataTypes, Model } = require("sequelize");

class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        status: {
          type: DataTypes.ENUM("pending", "completed", "canceled"),
          defaultValue: "pending",
        },
        totalAmount: {
          type: DataTypes.FLOAT,
          defaultValue: 0.0,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: false,
      },
    );
  }
}

module.exports = Order;
