// src/controllers/subscriptionsController.js

const { Op } = require("sequelize");

function addMonths(date, months) {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() + months);
  return d;
}

const subscriptionsController = {
  /* ==============================
   * PUBLIC
   * ============================== */

  // GET /api/subscriptions/plans
  async listActivePlans(req, res) {
    try {
      const models = req.app.get("models");
      const { SubscriptionPlan, SubscriptionPlanFeature } = models;

      const plans = await SubscriptionPlan.findAll({
        where: { status: "active" },
        include: [
          {
            model: SubscriptionPlanFeature,
            as: "features",
            order: [["sort_order", "ASC"]],
          },
        ],
        order: [["price", "ASC"]],
      });

      res.json(plans);
    } catch (error) {
      console.error("Error listActivePlans:", error);
      res.status(500).json({ message: "Error al obtener planes de suscripción" });
    }
  },

  // GET /api/subscriptions/plans/:id
  async getPlanById(req, res) {
    try {
      const models = req.app.get("models");
      const { SubscriptionPlan, SubscriptionPlanFeature } = models;
      const { id } = req.params;

      const plan = await SubscriptionPlan.findByPk(id, {
        include: [
          {
            model: SubscriptionPlanFeature,
            as: "features",
            order: [["sort_order", "ASC"]],
          },
        ],
      });

      if (!plan || plan.status === "inactive" || plan.status === "hidden") {
        return res.status(404).json({ message: "Plan no encontrado" });
      }

      res.json(plan);
    } catch (error) {
      console.error("Error getPlanById:", error);
      res.status(500).json({ message: "Error al obtener el plan" });
    }
  },

  /* ==============================
   * USER SUBSCRIPTION
   * ============================== */

  // GET /api/subscriptions/me/current
  async getMyCurrentSubscription(req, res) {
    try {
      const models = req.app.get("models");
      const { UserSubscription, SubscriptionPlan } = models;
      const userId = req.user.id;

      const now = new Date();

      const subscription = await UserSubscription.findOne({
        where: {
          user_id: userId,
          status: {
            [Op.in]: ["active", "pending"],
          },
          [Op.or]: [{ end_date: null }, { end_date: { [Op.gt]: now } }],
        },
        include: [
          {
            model: SubscriptionPlan,
            as: "plan",
            include: [{ association: "features" }],
          },
        ],
        order: [["start_date", "DESC"]],
      });

      if (!subscription) {
        return res.json({ hasSubscription: false, subscription: null });
      }

      res.json({ hasSubscription: true, subscription });
    } catch (error) {
      console.error("Error getMyCurrentSubscription:", error);
      res.status(500).json({ message: "Error al obtener la suscripción actual" });
    }
  },

  // POST /api/subscriptions/me/subscribe
  // body: { plan_id } (o planId)
  async subscribeToPlan(req, res) {
    const sequelize = req.app.get("sequelize");
    const t = await sequelize.transaction();

    try {
      const models = req.app.get("models");
      const { SubscriptionPlan, UserSubscription } = models;

      const userId = req.user.id;
      const planId = req.body.plan_id || req.body.planId;

      if (!planId) {
        await t.rollback();
        return res.status(400).json({
          message: "Debe indicar un plan_id",
        });
      }

      const plan = await SubscriptionPlan.findByPk(planId, { transaction: t });

      if (!plan || plan.status !== "active") {
        await t.rollback();
        return res.status(404).json({
          message: "El plan indicado no está disponible",
        });
      }

      const now = new Date();
      const endDate = addMonths(now, 1); // por ahora siempre mensual

      // 1) Cancelar/expirar suscripciones previas activas del usuario
      await UserSubscription.update(
        {
          status: "cancelled",
          end_date: now,
          auto_renew: false,
        },
        {
          where: {
            user_id: userId,
            status: {
              [Op.in]: ["active", "pending"],
            },
          },
          transaction: t,
        },
      );

      // 2) Crear nueva suscripción
      const subscription = await UserSubscription.create(
        {
          user_id: userId,
          plan_id: plan.id,
          status: "active", // si más adelante metés pagos externos, podés usar "pending"
          start_date: now,
          end_date: endDate,
          auto_renew: true,
        },
        { transaction: t },
      );

      // 3) Actualizar contador de suscriptores (opcional incremental)
      await plan.update({ subscribers_count: plan.subscribers_count + 1 }, { transaction: t });

      await t.commit();

      res.status(201).json({
        message: "Suscripción creada/actualizada correctamente",
        subscription,
      });
    } catch (error) {
      console.error("Error subscribeToPlan:", error);
      await t.rollback();
      res.status(500).json({ message: "Error al suscribirse al plan" });
    }
  },

  // POST /api/subscriptions/me/cancel
  async cancelMySubscription(req, res) {
    const sequelize = req.app.get("sequelize");
    const t = await sequelize.transaction();

    try {
      const models = req.app.get("models");
      const { UserSubscription } = models;
      const userId = req.user.id;

      const now = new Date();

      const activeSubs = await UserSubscription.findAll({
        where: {
          user_id: userId,
          status: {
            [Op.in]: ["active", "pending"],
          },
        },
        transaction: t,
      });

      if (!activeSubs || activeSubs.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: "No tenés suscripciones activas para cancelar" });
      }

      for (const sub of activeSubs) {
        await sub.update(
          {
            status: "cancelled",
            end_date: now,
            auto_renew: false,
          },
          { transaction: t },
        );
      }

      await t.commit();

      res.json({ message: "Suscripción cancelada correctamente" });
    } catch (error) {
      console.error("Error cancelMySubscription:", error);
      await t.rollback();
      res.status(500).json({ message: "Error al cancelar la suscripción" });
    }
  },

  /* ==============================
   * ADMIN
   * ============================== */

  // POST /api/subscriptions/admin/plans
  async createPlan(req, res) {
    try {
      const models = req.app.get("models");
      const { SubscriptionPlan } = models;

      const plan = await SubscriptionPlan.create(req.body);

      res.status(201).json(plan);
    } catch (error) {
      console.error("Error createPlan:", error);
      res.status(500).json({ message: "Error al crear plan de suscripción" });
    }
  },

  // PUT /api/subscriptions/admin/plans/:id
  async updatePlan(req, res) {
    try {
      const models = req.app.get("models");
      const { SubscriptionPlan } = models;
      const { id } = req.params;

      const plan = await SubscriptionPlan.findByPk(id);

      if (!plan) {
        return res.status(404).json({ message: "Plan no encontrado" });
      }

      await plan.update(req.body);

      res.json(plan);
    } catch (error) {
      console.error("Error updatePlan:", error);
      res.status(500).json({ message: "Error al actualizar plan" });
    }
  },

  // DELETE /api/subscriptions/admin/plans/:id
  async deletePlan(req, res) {
    try {
      const models = req.app.get("models");
      const { SubscriptionPlan } = models;
      const { id } = req.params;

      const plan = await SubscriptionPlan.findByPk(id);

      if (!plan) {
        return res.status(404).json({ message: "Plan no encontrado" });
      }

      // Soft delete: mejor marcar como "inactive" que borrarlo
      await plan.update({ status: "inactive" });

      res.json({ message: "Plan marcado como inactivo" });
    } catch (error) {
      console.error("Error deletePlan:", error);
      res.status(500).json({ message: "Error al eliminar plan" });
    }
  },

  // GET /api/subscriptions/admin/plans/:id/subscribers
  async listPlanSubscribers(req, res) {
    try {
      const models = req.app.get("models");
      const { SubscriptionPlan, UserSubscription, User } = models;
      const { id: planId } = req.params;

      const plan = await SubscriptionPlan.findByPk(planId);

      if (!plan) {
        return res.status(404).json({ message: "Plan no encontrado" });
      }

      const subs = await UserSubscription.findAll({
        where: { plan_id: planId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstname", "lastname", "email"],
          },
        ],
        order: [["start_date", "DESC"]],
      });

      res.json({
        plan,
        subscribers: subs,
      });
    } catch (error) {
      console.error("Error listPlanSubscribers:", error);
      res.status(500).json({
        message: "Error al obtener suscriptores del plan",
      });
    }
  },
};

module.exports = subscriptionsController;
