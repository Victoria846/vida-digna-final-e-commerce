const { DataTypes, Model } = require("sequelize");

class Content extends Model {
  static initModel(sequelize) {
    Content.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        body: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        publishedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        authorId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: "Content",
        tableName: "contents",
        timestamps: true,
      },
    );
  }

  static associate(models) {
    // Definir asociaciones aquí si es necesario
  }
}

module.exports = Content;
