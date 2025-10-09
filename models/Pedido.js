const { DataTypes, Model } = require("sequelize");

class Pedido extends Model {
  static initModel(sequelize) {
    Pedido.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        usuarioId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        fecha: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
        estado: {
          type: DataTypes.STRING,
          defaultValue: "pendiente",
        },
        total: {
          type: DataTypes.FLOAT,
          defaultValue: 0.0,
        },
      },
      {
        sequelize,
        modelName: "Pedido",
        tableName: "pedidos",
        timestamps: false,
      },
    );
  }

  static associate(models) {
    Pedido.hasMany(models.ItemPedido, {
      foreignKey: "pedidoId",
      as: "items",
    });
  }
}

module.exports = Pedido;
