// src/routes/index.js
const express = require("express");

const storeRoutes = require("./store.routes");
const servicesRoutes = require("./services.routes");
const subscriptionsRoutes = require("./subscriptions.routes");
const contentRoutes = require("./content.routes");
const usersRoutes = require("./users.routes");

function registerRoutes(app) {
  const api = express.Router();

  // Rutas públicas y protegidas agrupadas bajo /api
  api.use("/store", storeRoutes); // /api/store/...
  api.use("/services", servicesRoutes); // /api/services/...
  api.use("/subscriptions", subscriptionsRoutes); // /api/subscriptions/...
  api.use("/content", contentRoutes); // /api/content/...
  api.use("/users", usersRoutes); // /api/users/...

  app.use("/api", api);
}

module.exports = registerRoutes;
