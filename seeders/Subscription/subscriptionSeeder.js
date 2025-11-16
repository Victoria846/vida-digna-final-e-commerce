// src/seeders/Subscription/subscriptionSeeder.js
async function seedSubscriptions(models) {
  const { SubscriptionPlan, SubscriptionPlanFeature, UserSubscription, User } = models;

  const planCount = await SubscriptionPlan.count();
  if (planCount > 0) {
    console.log("Planes de suscripción ya tienen datos, se salta seeder.");
    return;
  }

  // 1) Planes desde mockPlans
  const plansData = [
    {
      id: 1,
      name: "Plan Básico",
      price: 9.99,
      period: "mes",
      subscribers_count: 450,
      badge_color: "text-info",
      status: "active",
    },
    {
      id: 2,
      name: "Plan Premium",
      price: 19.99,
      period: "mes",
      subscribers_count: 234,
      badge_color: "text-primary",
      status: "active",
    },
    {
      id: 3,
      name: "Plan Empresarial",
      price: 49.99,
      period: "mes",
      subscribers_count: 89,
      badge_color: "text-warning",
      status: "active",
    },
  ];

  await SubscriptionPlan.bulkCreate(plansData, { ignoreDuplicates: true });

  // 2) Features por plan
  const featuresByPlan = {
    1: [
      "Acceso a contenido básico",
      "1 curso gratis al mes",
      "Descuento 10% en productos",
      "Newsletter semanal",
    ],
    2: [
      "Todo lo del Plan Básico",
      "3 cursos gratis al mes",
      "Descuento 20% en productos",
      "Acceso a talleres exclusivos",
      "Consultoría personalizada",
    ],
    3: [
      "Todo lo del Plan Premium",
      "Cursos ilimitados",
      "Descuento 30% en productos",
      "Soporte prioritario",
      "Talleres in-company",
      "Certificaciones oficiales",
    ],
  };

  const featureRows = [];
  Object.entries(featuresByPlan).forEach(([planId, features]) => {
    features.forEach((description, index) => {
      featureRows.push({
        plan_id: Number(planId),
        description,
        sort_order: index + 1,
      });
    });
  });

  if (SubscriptionPlanFeature && featureRows.length > 0) {
    await SubscriptionPlanFeature.bulkCreate(featureRows, {
      ignoreDuplicates: true,
    });
  }

  // 3) Suscripciones de ejemplo para usuarios
  if (UserSubscription && User) {
    const user1 = await User.findByPk(1);
    const user2 = await User.findByPk(2);

    const subs = [];

    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    if (user1) {
      subs.push({
        user_id: user1.id,
        plan_id: 1,
        status: "active",
        start_date: now,
        end_date: nextMonth,
        auto_renew: true,
      });
    }

    if (user2) {
      subs.push({
        user_id: user2.id,
        plan_id: 2,
        status: "active",
        start_date: now,
        end_date: nextMonth,
        auto_renew: true,
      });
    }

    if (subs.length > 0) {
      await UserSubscription.bulkCreate(subs, { ignoreDuplicates: true });
    }
  }

  console.log("Seeder de Subscriptions ejecutado.");
}

module.exports = { seedSubscriptions };
