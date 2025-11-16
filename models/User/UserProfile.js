// src/models/User/UserProfile.js
const { Model, DataTypes } = require("sequelize");

class UserProfile extends Model {
  static initModel(sequelize) {
    UserProfile.init(
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
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            len: {
              args: [5, 30],
              msg: "El teléfono debe tener entre 5 y 30 caracteres",
            },
          },
        },
        address: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        country: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        postal_code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "UserProfile",
        tableName: "user_profiles",
        timestamps: true,
        underscored: true,
      },
    );

    return UserProfile;
  }
}

module.exports = UserProfile;
