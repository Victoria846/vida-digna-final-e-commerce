// src/models/Service/Service.js
const { Model, DataTypes } = require("sequelize");

class Service extends Model {
  static initModel(sequelize) {
    Service.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El título no puede estar vacío" },
            len: {
              args: [3, 150],
              msg: "El título debe tener entre 3 y 150 caracteres",
            },
          },
        },
        type: {
          // Mantengo los valores del mock: "Curso" | "Taller"
          type: DataTypes.ENUM("Curso", "Taller"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["Curso", "Taller"]],
              msg: "El tipo debe ser 'Curso' o 'Taller'",
            },
          },
        },
        duration: {
          // Descripción legible: "4 semanas", "1 día", "2 días"
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "La duración no puede estar vacía" },
            len: {
              args: [2, 50],
              msg: "La duración debe tener entre 2 y 50 caracteres",
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
        students_count: {
          // de momento refleja lo que hoy tenés como "students" en el mock
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: { args: [0], msg: "La cantidad de estudiantes no puede ser negativa" },
          },
        },
        status: {
          type: DataTypes.ENUM("active", "draft", "inactive"),
          allowNull: false,
          defaultValue: "draft",
          validate: {
            isIn: {
              args: [["active", "draft", "inactive"]],
              msg: "Estado inválido",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "Service",
        tableName: "services",
        timestamps: true,
        underscored: true,
      },
    );

    return Service;
  }
}

module.exports = Service;
