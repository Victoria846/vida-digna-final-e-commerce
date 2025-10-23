const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static initModel(sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        firstname: {
          type: DataTypes.STRING,
        },
        lastname: {
          type: DataTypes.STRING,
        },
        email: {
          type: DataTypes.STRING,
        },
        address: {
          type: DataTypes.STRING,
        },
        phone: {
          type: DataTypes.STRING,
        },
        password: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        modelName: "user", // Nombre del modelo en singular y en minúscula.
        tableName: "users",
      },
    );
    return User;
  }
}

module.exports = User;
