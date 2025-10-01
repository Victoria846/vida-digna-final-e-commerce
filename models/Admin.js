const { Model, DataTypes } = require("sequelize");

class Admin extends Model {
  static initModel(sequelize) {
    Admin.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        firstname: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: { msg: "El nombre no puede estar vacío" },
            len: { args: [2, 50], msg: "El nombre debe tener entre 2 y 50 caracteres" },
          },
        },
        lastname: {
          type: DataTypes.STRING,
          validate: {
            notEmpty: { msg: "El apellido no puede estar vacío" },
            len: { args: [2, 50], msg: "El apellido debe tener entre 2 y 50 caracteres" },
          },
        },
        role: {
          type: DataTypes.ENUM("admingeneral", "editor", "espectador"),
          defaultValue: "editor",
          validate: {
            isIn: {
              args: [["admingeneral", "editor", "espectador"]],
              msg: "El rol debe ser admingeneral, editor o espectador",
            },
          },
        },
        email: {
          type: DataTypes.STRING,
          unique: { msg: "El email ya está en uso" },
          validate: {
            notEmpty: { msg: "El email no puede estar vacío" },
            isEmail: { msg: "Formato de email inválido" },
            len: { args: [5, 255], msg: "El email debe tener entre 5 y 255 caracteres" },
          },
          password: {
            type: DataTypes.STRING,
            validate: {
              notEmpty: { msg: "La contraseña no puede estar vacía" },
              len: { args: [8, 100], msg: "La contraseña debe tener entre 8 y 100 caracteres" },
            },
          },
        },
      },
      {
        sequelize,
        modelName: "admin",
      },
    );
    return Admin;
  }
}

module.exports = Admin;
