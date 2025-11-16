// src/models/Service/ServiceEnrollment.js
const { Model, DataTypes } = require("sequelize");

class ServiceEnrollment extends Model {
  static initModel(sequelize) {
    ServiceEnrollment.init(
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
        service_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "services",
            key: "id",
          },
        },
        status: {
          type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
          allowNull: false,
          defaultValue: "pending",
          validate: {
            isIn: {
              args: [["pending", "confirmed", "cancelled", "completed"]],
              msg: "Estado de inscripción inválido",
            },
          },
        },
        // campo libre por si querés guardar algo adicional del usuario
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "ServiceEnrollment",
        tableName: "service_enrollments",
        timestamps: true,
        underscored: true,
      },
    );

    return ServiceEnrollment;
  }
}

module.exports = ServiceEnrollment;
