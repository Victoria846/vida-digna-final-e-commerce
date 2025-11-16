// src/models/Content/BlogPost.js
const { Model, DataTypes } = require("sequelize");

class BlogPost extends Model {
  static initModel(sequelize) {
    BlogPost.init(
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
        excerpt: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        published_at: {
          // viene de tu mock "date": "2024-01-15"
          type: DataTypes.DATEONLY,
          allowNull: false,
          validate: {
            isDate: { msg: "La fecha de publicación no es válida" },
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
          type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
          allowNull: false,
          defaultValue: "draft",
          validate: {
            isIn: {
              args: [["draft", "scheduled", "published", "archived"]],
              msg: "Estado de publicación inválido",
            },
          },
        },
      },
      {
        sequelize,
        modelName: "BlogPost",
        tableName: "blog_posts",
        timestamps: true,
        underscored: true,
      },
    );

    return BlogPost;
  }
}

module.exports = BlogPost;
