const faker = require("@faker-js/faker").fakerES;
const { Admin } = require("../models");

module.exports = async () => {
  const admins = [];

  for (let i = 0; i < 100; i++) {
    admins.push({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
    });
  }

  await Admin.bulkCreate(admins);
  console.log("[Database] Se corrió el seeder de Admins.");
};
