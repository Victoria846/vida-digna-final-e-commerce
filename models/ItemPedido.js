const { DataTypes, Model } = require("sequelize");

class ItemPedido extends Model {
  static initModel(sequelize) {
    ItemPedido.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        pedidoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        productoId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        cantidad: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        precioUnitario: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "ItemPedido",
        tableName: "items_pedido",
        timestamps: false,
      },
    );
  }

  static associate(models) {
    ItemPedido.belongsTo(models.Pedido, {
      foreignKey: "pedidoId",
      as: "pedido",
    });
  }
}

module.exports = ItemPedido;
