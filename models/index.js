// models/index.js
const sequelize = require("../config/database");
const initModels = require("./initModels");

// Inicializar todos los modelos y asociaciones
const models = initModels(sequelize);

// Exportamos sequelize + todos los modelos
module.exports = {
  sequelize,
  ...models,
};
