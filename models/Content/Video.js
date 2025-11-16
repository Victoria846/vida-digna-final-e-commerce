// src/models/Content/Video.js
const { Model, DataTypes } = require("sequelize");

class Video extends Model {
  static initModel(sequelize) {
    Video.init(
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
        video_url: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "La URL del video no puede estar vacía" },
            isUrl: { msg: "La URL del video no es válida" },
          },
        },
        thumbnail_url: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isUrl: { msg: "La URL de la miniatura no es válida" },
          },
        },
        duration: {
          // "12:34", "18:22", etc.
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "La duración no puede estar vacía" },
          },
        },
        views: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: { args: [0], msg: "Las vistas no pueden ser negativas" },
          },
        },
        status: {
          type: DataTypes.ENUM("draft", "published", "hidden"),
          allowNull: false,
          defaultValue: "published",
          validate: {
            isIn: {
              args: [["draft", "published", "hidden"]],
              msg: "Estado de video inválido",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "Video",
        tableName: "videos",
        timestamps: true,
        underscored: true,
      },
    );

    return Video;
  }
}

module.exports = Video;
