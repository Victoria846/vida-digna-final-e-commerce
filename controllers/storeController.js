// src/controllers/storeController.js
const { Op } = require("sequelize");

const storeController = {
  /* PUBLIC */

  async listProducts(req, res) {
    try {
      const models = req.app.get("models");
      const { Product, ProductCategory } = models;

      const { category, status, search } = req.query;

      const where = {};
      if (status) where.status = status;
      if (search) where.name = { [Op.like]: `%${search}%` };

      const include = [];

      if (category) {
        include.push({
          model: ProductCategory,
          as: "category",
          where: { slug: category },
        });
      } else {
        include.push({ model: ProductCategory, as: "category" });
      }

      const products = await Product.findAll({ where, include });

      res.json(products);
    } catch (error) {
      console.error("Error listProducts:", error);
      res.status(500).json({ message: "Error al obtener productos" });
    }
  },

  async getProductById(req, res) {
    try {
      const models = req.app.get("models");
      const { Product, ProductCategory } = models;

      const { id } = req.params;

      const product = await Product.findByPk(id, {
        include: [{ model: ProductCategory, as: "category" }],
      });

      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      res.json(product);
    } catch (error) {
      console.error("Error getProductById:", error);
      res.status(500).json({ message: "Error al obtener el producto" });
    }
  },

  async listCategories(req, res) {
    try {
      const models = req.app.get("models");
      const { ProductCategory } = models;

      const categories = await ProductCategory.findAll();
      res.json(categories);
    } catch (error) {
      console.error("Error listCategories:", error);
      res.status(500).json({ message: "Error al obtener categorías" });
    }
  },

  async listProductsByCategorySlug(req, res) {
    try {
      const models = req.app.get("models");
      const { ProductCategory, Product } = models;
      const { slug } = req.params;

      const category = await ProductCategory.findOne({ where: { slug } });

      if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

      const products = await Product.findAll({
        where: { category_id: category.id },
        include: [{ model: ProductCategory, as: "category" }],
      });

      res.json(products);
    } catch (error) {
      console.error("Error listProductsByCategorySlug:", error);
      res.status(500).json({ message: "Error al obtener productos" });
    }
  },

  /* ADMIN - PRODUCTOS */

  async createProduct(req, res) {
    try {
      const models = req.app.get("models");
      const { Product } = models;

      console.log("[createProduct] BODY:", req.body);
      console.log("[createProduct] FILE:", req.file);

      const { name, description, price, stock, category_id } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Debe enviar el nombre del producto" });
      }

      // Parseo seguro de precio (viene como string desde el form)
      let parsedPrice = null;
      if (price !== undefined && price !== null && price !== "") {
        parsedPrice = Number(price);
        if (Number.isNaN(parsedPrice)) {
          return res.status(400).json({ message: "Precio inválido" });
        }
      }

      const parsedStock = stock !== undefined && stock !== null && stock !== "" ? Number(stock) : 0;

      const parsedCategoryId =
        category_id !== undefined && category_id !== null && category_id !== ""
          ? Number(category_id)
          : null;

      let image_url = null;

      // Si subieron archivo, armamos la URL pública
      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        image_url = `${baseUrl}/uploads/${req.file.filename}`;
      } else if (req.body.image_url) {
        // También permitimos una URL directa en vez de archivo
        image_url = req.body.image_url;
      }

      const product = await Product.create({
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        category_id: parsedCategoryId,
        image_url,
        status: "active",
      });

      return res.status(201).json({
        message: "Producto creado correctamente",
        product,
      });
    } catch (error) {
      console.error("Error createProduct:", error);
      return res.status(500).json({ message: "Error al crear producto" });
    }
  },

  async createProduct(req, res) {
    try {
      const models = req.app.get("models");
      const { Product } = models;

      console.log("[createProduct] CONTENT-TYPE:", req.headers["content-type"]);
      console.log("[createProduct] BODY:", req.body);
      console.log("[createProduct] FILE:", req.file);

      const { name, description, price, stock, category_id } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Debe enviar el nombre del producto" });
      }

      let parsedPrice = null;
      if (price !== undefined && price !== null && price !== "") {
        parsedPrice = Number(price);
        if (Number.isNaN(parsedPrice)) {
          return res.status(400).json({ message: "Precio inválido" });
        }
      }

      const parsedStock = stock !== undefined && stock !== null && stock !== "" ? Number(stock) : 0;

      const parsedCategoryId =
        category_id !== undefined && category_id !== null && category_id !== ""
          ? Number(category_id)
          : null;

      let image_url = null;

      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        image_url = `${baseUrl}/uploads/${req.file.filename}`;
      } else if (req.body.image_url) {
        image_url = req.body.image_url;
      }

      const product = await Product.create({
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        category_id: parsedCategoryId,
        image_url,
        status: "active",
      });

      return res.status(201).json({
        message: "Producto creado correctamente",
        product,
      });
    } catch (error) {
      console.error("Error createProduct:", error);
      return res.status(500).json({ message: "Error al crear producto" });
    }
  },

  async updateProduct(req, res) {
    try {
      const models = req.app.get("models");
      const { Product } = models;
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      await product.update(req.body);

      res.json(product);
    } catch (error) {
      console.error("Error updateProduct:", error);
      res.status(500).json({ message: "Error al actualizar producto" });
    }
  },

  async deleteProduct(req, res) {
    try {
      const models = req.app.get("models");
      const { Product } = models;
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ message: "Producto no encontrado" });

      await product.destroy();

      res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      console.error("Error deleteProduct:", error);
      res.status(500).json({ message: "Error al eliminar producto" });
    }
  },

  /* ADMIN - CATEGORÍAS */

  async createCategory(req, res) {
    try {
      const models = req.app.get("models");
      const { ProductCategory } = models;

      const category = await ProductCategory.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error createCategory:", error);
      res.status(500).json({ message: "Error al crear categoría" });
    }
  },

  async updateCategory(req, res) {
    try {
      const models = req.app.get("models");
      const { ProductCategory } = models;
      const { id } = req.params;

      const category = await ProductCategory.findByPk(id);
      if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

      await category.update(req.body);

      res.json(category);
    } catch (error) {
      console.error("Error updateCategory:", error);
      res.status(500).json({ message: "Error al actualizar categoría" });
    }
  },

  async deleteCategory(req, res) {
    try {
      const models = req.app.get("models");
      const { ProductCategory } = models;
      const { id } = req.params;

      const category = await ProductCategory.findByPk(id);
      if (!category) return res.status(404).json({ message: "Categoría no encontrada" });

      await category.destroy();

      res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
      console.error("Error deleteCategory:", error);
      res.status(500).json({ message: "Error al eliminar categoría" });
    }
  },
};

module.exports = storeController;
