const sequelize = require("../config/database");
const initModels = require("./initModels");

const models = initModels(sequelize);

module.exports = {
  sequelize,
  ...models,
};
