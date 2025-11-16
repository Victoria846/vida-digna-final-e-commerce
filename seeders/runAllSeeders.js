// src/seeders/runAllSeeders.js
const { Sequelize } = require("sequelize");
const initModels = require("../models");

const { seedUsers } = require("./User/userSeeder");
const { seedStore } = require("./Store/storeSeeder");
const { seedServices } = require("./Service/serviceSeeder");
const { seedSubscriptions } = require("./Subscription/subscriptionSeeder");
const { seedContent } = require("./Content/contentSeeder");

async function runAllSeeders() {
  // 👉 Ajustá esto a tu config real (o importá tu instancia de sequelize)
  const sequelize = new Sequelize(
    process.env.DB_NAME || "eco_project",
    process.env.DB_USER || "root",
    process.env.DB_PASSWORD || "",
    {
      host: process.env.DB_HOST || "localhost",
      dialect: "mysql",
      logging: false,
    },
  );

  try {
    const models = initModels(sequelize);

    console.log("Sincronizando modelos...");
    await sequelize.sync({ alter: true }); // o { force: true } en desarrollo inicial

    console.log("Ejecutando seeders...");

    await seedUsers(models);
    await seedStore(models);
    await seedServices(models);
    await seedSubscriptions(models);
    await seedContent(models);

    console.log("✅ Todos los seeders se ejecutaron correctamente.");
  } catch (error) {
    console.error("❌ Error ejecutando seeders:", error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  runAllSeeders();
}

module.exports = { runAllSeeders };
