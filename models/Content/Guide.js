// src/models/Content/Guide.js
const { Model, DataTypes } = require("sequelize");

class Guide extends Model {
  static initModel(sequelize) {
    Guide.init(
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
              args: [3, 200],
              msg: "El título debe tener entre 3 y 200 caracteres",
            },
          },
        },
        slug: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: { msg: "El slug no puede estar vacío" },
            is: {
              args: /^[a-z0-9-]+$/i,
              msg: "El slug solo puede contener letras, números y guiones",
            },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        file_url: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "La URL del archivo no puede estar vacía" },
            isUrl: { msg: "La URL del archivo no es válida" },
          },
        },
        format: {
          type: DataTypes.ENUM("PDF", "EPUB", "DOCX", "LINK"),
          allowNull: false,
          defaultValue: "PDF",
          validate: {
            isIn: {
              args: [["PDF", "EPUB", "DOCX", "LINK"]],
              msg: "Formato de guía inválido",
            },
          },
        },
        downloads: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: { args: [0], msg: "Las descargas no pueden ser negativas" },
          },
        },
        status: {
          type: DataTypes.ENUM("active", "inactive"),
          allowNull: false,
          defaultValue: "active",
          validate: {
            isIn: {
              args: [["active", "inactive"]],
              msg: "Estado de guía inválido",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "Guide",
        tableName: "guides",
        timestamps: true,
        underscored: true,
      },
    );

    return Guide;
  }
}

module.exports = Guide;
