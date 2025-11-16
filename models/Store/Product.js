const { Model, DataTypes } = require("sequelize");

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
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
            notEmpty: { msg: "El nombre del producto no puede estar vacío" },
            len: {
              args: [2, 150],
              msg: "El nombre debe tener entre 2 y 150 caracteres",
            },
          },
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: { msg: "El precio debe ser un número válido" },
          },
        },
        stock: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: { args: [0], msg: "El stock no puede ser negativo" },
          },
        },
        status: {
          type: DataTypes.ENUM("active", "inactive", "out_of_stock"),
          defaultValue: "active",
          validate: {
            isIn: {
              args: [["active", "inactive", "out_of_stock"]],
              msg: "Estado inválido",
            },
          },
        },
        image_url: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isUrl: {
              msg: "La imagen debe ser una URL válida",
            },
          },
        },
        category_id: {
          type: DataTypes.BIGINT.UNSIGNED,
          allowNull: false,
          references: {
            model: "product_categories",
            key: "id",
          },
        },
      },
      {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
        underscored: true,
      },
    );

    return Product;
  }
}

module.exports = Product;
