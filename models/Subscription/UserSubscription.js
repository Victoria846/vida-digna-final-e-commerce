// src/models/Subscription/UserSubscription.js
const { Model, DataTypes } = require("sequelize");

class UserSubscription extends Model {
  static initModel(sequelize) {
    UserSubscription.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        plan_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "subscription_plans",
            key: "id",
          },
        },
        status: {
          type: DataTypes.ENUM("active", "cancelled", "expired", "pending"),
          allowNull: false,
          defaultValue: "pending",
          validate: {
            isIn: {
              args: [["active", "cancelled", "expired", "pending"]],
              msg: "Estado de suscripción inválido",
            },
          },
        },
        start_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        auto_renew: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        modelName: "UserSubscription",
        tableName: "user_subscriptions",
        timestamps: true,
        underscored: true,
      },
    );

    return UserSubscription;
  }
}

module.exports = UserSubscription;
