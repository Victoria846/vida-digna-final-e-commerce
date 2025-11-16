// src/controllers/orderController.js

const orderController = {
  /* ==============================
   * ÓRDENES DEL USUARIO LOGUEADO
   * ============================== */

  // GET /api/store/me/orders
  async listMyOrders(req, res) {
    try {
      const models = req.app.get("models");
      const { Order, OrderItem, Product } = models;
      const userId = req.user.id;

      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(orders);
    } catch (error) {
      console.error("Error listMyOrders:", error);
      res.status(500).json({ message: "Error al obtener órdenes" });
    }
  },

  // GET /api/store/me/orders/:id
  async getMyOrderById(req, res) {
    try {
      const models = req.app.get("models");
      const { Order, OrderItem, Product } = models;
      const userId = req.user.id;
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id, user_id: userId },
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error getMyOrderById:", error);
      res.status(500).json({ message: "Error al obtener orden" });
    }
  },

  /* ==============================
   * CREAR ORDEN (CHECKOUT)
   * ============================== */

  // POST /api/store/orders
  // body: { items: [{ product_id, quantity }], currency? }
  async createOrderFromPayload(req, res) {
    const sequelize = req.app.get("sequelize");
    const t = await sequelize.transaction();

    try {
      const models = req.app.get("models");
      const { Order, OrderItem, Product } = models;
      const userId = req.user.id;
      const { items, currency } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: "Debe enviar al menos un item en la orden" });
      }

      let total = 0;
      const productCache = {};

      // 1) Verificar productos + stock y calcular total
      for (const item of items) {
        if (!item.product_id || !item.quantity) {
          await t.rollback();
          return res.status(400).json({
            message: "Cada item debe tener product_id y quantity",
          });
        }

        let product = productCache[item.product_id];
        if (!product) {
          product = await Product.findByPk(item.product_id, { transaction: t });
          productCache[item.product_id] = product;
        }

        if (!product) {
          await t.rollback();
          return res.status(404).json({
            message: `Producto con ID ${item.product_id} no existe`,
          });
        }

        const quantity = Number(item.quantity);

        if (product.stock < quantity) {
          await t.rollback();
          return res.status(400).json({
            message: `No hay stock suficiente para ${product.name}`,
          });
        }

        total += Number(product.price) * quantity;
      }

      // 2) Crear orden
      const order = await Order.create(
        {
          user_id: userId,
          status: "pending",
          total_amount: total,
          currency: currency || "USD",
        },
        { transaction: t },
      );

      // 3) Crear order_items + actualizar stock
      for (const item of items) {
        const product = productCache[item.product_id];
        const quantity = Number(item.quantity);
        const unitPrice = Number(product.price);
        const subtotal = unitPrice * quantity;

        await OrderItem.create(
          {
            order_id: order.id,
            product_id: product.id,
            quantity,
            unit_price: unitPrice,
            subtotal,
          },
          { transaction: t },
        );

        await product.update({ stock: product.stock - quantity }, { transaction: t });
      }

      await t.commit();

      res.status(201).json({
        message: "Orden creada correctamente",
        order_id: order.id,
      });
    } catch (error) {
      console.error("Error createOrderFromPayload:", error);
      await t.rollback();
      res.status(500).json({ message: "Error al crear orden" });
    }
  },

  /* ==============================
   * ADMIN
   * ============================== */

  // GET /api/store/admin/orders
  async listAllOrders(req, res) {
    try {
      const models = req.app.get("models");
      const { Order, OrderItem, Product, User } = models;

      const orders = await Order.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstname", "lastname", "email"],
          },
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      res.json(orders);
    } catch (error) {
      console.error("Error listAllOrders:", error);
      res.status(500).json({
        message: "Error al obtener todas las órdenes",
      });
    }
  },

  // GET /api/store/admin/orders/:id
  async getOrderById(req, res) {
    try {
      const models = req.app.get("models");
      const { Order, OrderItem, Product, User } = models;
      const { id } = req.params;

      const order = await Order.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstname", "lastname", "email"],
          },
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      if (!order) {
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      res.json(order);
    } catch (error) {
      console.error("Error getOrderById:", error);
      res.status(500).json({ message: "Error al obtener la orden" });
    }
  },
};

module.exports = orderController;
