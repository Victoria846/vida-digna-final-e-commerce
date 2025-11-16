// src/models/User/User.js
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
          allowNull: false,
          validate: {
            notEmpty: { msg: "El nombre no puede estar vacío" },
            len: {
              args: [2, 50],
              msg: "El nombre debe tener entre 2 y 50 caracteres",
            },
          },
        },
        lastname: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El apellido no puede estar vacío" },
            len: {
              args: [2, 50],
              msg: "El apellido debe tener entre 2 y 50 caracteres",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: { msg: "El email ya está en uso" },
          validate: {
            notEmpty: { msg: "El email no puede estar vacío" },
            isEmail: { msg: "Formato de email inválido" },
            len: {
              args: [5, 255],
              msg: "El email debe tener entre 5 y 255 caracteres",
            },
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "La contraseña no puede estar vacía" },
            len: {
              args: [8, 100],
              msg: "La contraseña debe tener entre 8 y 100 caracteres",
            },
          },
        },
        role: {
          // Rol funcional del usuario final, no confundir con Admin
          type: DataTypes.ENUM("client", "subscriber", "instructor"),
          allowNull: false,
          defaultValue: "client",
          validate: {
            isIn: {
              args: [["client", "subscriber", "instructor"]],
              msg: "Rol inválido",
            },
          },
        },
        status: {
          type: DataTypes.ENUM("active", "inactive", "banned"),
          allowNull: false,
          defaultValue: "active",
          validate: {
            isIn: {
              args: [["active", "inactive", "banned"]],
              msg: "Estado de usuario inválido",
            },
          },
        },
        last_login_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        underscored: true,
      },
    );

    return User;
  }
}

module.exports = User;
