// seeders/runAllSeeders.js
require("dotenv").config();

const db = require("../models");

// Importar seeders
const { seedUsers } = require("./User/userSeeder");
const { seedStore } = require("./Store/storeSeeder");
const { seedServices } = require("./Service/serviceSeeder");
const { seedSubscriptions } = require("./Subscription/subscriptionSeeder");
const { seedContent } = require("./Content/contentSeeder");

async function runAllSeeders() {
  try {
    console.log("\n🔄  Conectando a la base de datos...");

    // Verificar conexión
    await db.sequelize.authenticate();
    console.log("✅  Conexión establecida.");

    console.log("🚀 Ejecutando todos los seeders...\n");

    await seedUsers(db);
    console.log("👤 Users ✔️");

    await seedStore(db);
    console.log("🛒 Store ✔️");

    await seedServices(db);
    console.log("🧰 Services ✔️");

    await seedSubscriptions(db);
    console.log("💳 Subscriptions ✔️");

    await seedContent(db);
    console.log("📚 Content ✔️");

    console.log("\n🎉 TODOS LOS SEEDERS SE EJECUTARON CORRECTAMENTE 🎉\n");
  } catch (error) {
    console.error("❌ Error ejecutando seeders:\n", error);
  } finally {
    await db.sequelize.close();
    console.log("🔌 Conexión cerrada.");
  }
}

if (require.main === module) {
  runAllSeeders();
}

module.exports = { runAllSeeders };
