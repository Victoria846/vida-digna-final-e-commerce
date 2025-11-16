// src/models/Subscription/SubscriptionPlanFeature.js
const { Model, DataTypes } = require("sequelize");

class SubscriptionPlanFeature extends Model {
  static initModel(sequelize) {
    SubscriptionPlanFeature.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        plan_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "subscription_plans",
            key: "id",
          },
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "La descripción de la característica no puede estar vacía" },
            len: {
              args: [3, 255],
              msg: "La característica debe tener entre 3 y 255 caracteres",
            },
          },
        },
        sort_order: {
          // para ordenarlas (1,2,3...) en la UI
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 1,
        },
      },
      {
        sequelize,
        modelName: "SubscriptionPlanFeature",
        tableName: "subscription_plan_features",
        timestamps: true,
        underscored: true,
      },
    );

    return SubscriptionPlanFeature;
  }
}

module.exports = SubscriptionPlanFeature;
