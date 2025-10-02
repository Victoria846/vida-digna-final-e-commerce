const faker = require("@faker-js/faker").fakerES;
const { Admin } = require("../models");

module.exports = async () => {
  const admins = [];
  const roles = ["admin", "superadmin", "editor"];

  for (let i = 0; i < 100; i++) {
    admins.push({
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email().toLocaleLowerCase(),
      password: "12345678",
      role: roles[Math.floor(Math.random() * roles.length)],
    });
  }

  await Admin.bulkCreate("admins", admins);
  console.log("[Database] Se corrió el seeder de Admins.");
};
