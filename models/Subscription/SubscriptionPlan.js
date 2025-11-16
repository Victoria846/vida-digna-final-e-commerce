// src/models/Subscription/SubscriptionPlan.js
const { Model, DataTypes } = require("sequelize");

class SubscriptionPlan extends Model {
  static initModel(sequelize) {
    SubscriptionPlan.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El nombre del plan no puede estar vacío" },
            len: {
              args: [3, 100],
              msg: "El nombre del plan debe tener entre 3 y 100 caracteres",
            },
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: { msg: "El precio debe ser un número válido" },
            min: { args: [0], msg: "El precio no puede ser negativo" },
          },
        },
        period: {
          // Por ahora solo "mes", pero se puede extender luego
          type: DataTypes.ENUM("mes"),
          allowNull: false,
          defaultValue: "mes",
          validate: {
            isIn: {
              args: [["mes"]],
              msg: "El período debe ser 'mes'",
            },
          },
        },
        subscribers_count: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: { args: [0], msg: "La cantidad de suscriptores no puede ser negativa" },
          },
        },
        badge_color: {
          // text-info, text-primary, text-warning...
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("active", "inactive", "hidden"),
          allowNull: false,
          defaultValue: "active",
          validate: {
            isIn: {
              args: [["active", "inactive", "hidden"]],
              msg: "Estado de plan inválido",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "SubscriptionPlan",
        tableName: "subscription_plans",
        timestamps: true,
        underscored: true,
      },
    );

    return SubscriptionPlan;
  }
}

module.exports = SubscriptionPlan;
