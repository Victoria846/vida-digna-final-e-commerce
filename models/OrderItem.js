const { DataTypes, Model } = require("sequelize");

class OrderItem extends Model {
  static initModel(sequelize) {
    OrderItem.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        itemType: {
          type: DataTypes.ENUM("product", "service", "workshop"),
          allowNull: false,
        },
        itemId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "OrderItem",
        tableName: "order_items",
        timestamps: false,
      },
    );
  }
}

module.exports = OrderItem;
