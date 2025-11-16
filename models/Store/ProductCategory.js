const { Model, DataTypes } = require("sequelize");

class ProductCategory extends Model {
  static initModel(sequelize) {
    ProductCategory.init(
      {
        id: {
          type: DataTypes.BIGINT.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: "El nombre de la categoría no puede estar vacío" },
            len: {
              args: [2, 100],
              msg: "La categoría debe tener entre 2 y 100 caracteres",
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
      },
      {
        sequelize,
        modelName: "ProductCategory",
        tableName: "product_categories",
        timestamps: true,
        underscored: true,
      },
    );

    return ProductCategory;
  }
}

module.exports = ProductCategory;
