// src/seeders/User/userSeeder.js
const bcrypt = require("bcrypt");

async function seedUsers(models) {
  const { User, UserProfile } = models;

  const userCount = await User.count();
  if (userCount > 0) {
    console.log("Users ya tienen datos, se salta seeder de Users.");
    return;
  }

  console.log("Seeding Users y UserProfiles...");

  // Contraseñas en texto plano para desarrollo
  const adminPlainPassword = "Admin123!";
  const juanPlainPassword = "Juan123!";
  const anaPlainPassword = "Ana123!";

  // Hasheamos igual que en el register
  const [adminPassword, juanPassword, anaPassword] = await Promise.all([
    bcrypt.hash(adminPlainPassword, 10),
    bcrypt.hash(juanPlainPassword, 10),
    bcrypt.hash(anaPlainPassword, 10),
  ]);

  const users = await User.bulkCreate(
    [
      {
        // ADMIN base para el panel
        firstname: "Super",
        lastname: "Admin",
        email: "admin@example.com",
        password: adminPassword, // ✅ hash real
        role: "admin", // ✅ importante para ProtectedRoute
        status: "active",
      },
      {
        firstname: "Juan",
        lastname: "Pérez",
        email: "juan@example.com",
        password: juanPassword, // ✅ hash real
        role: "client",
        status: "active",
      },
      {
        firstname: "Ana",
        lastname: "García",
        email: "ana@example.com",
        password: anaPassword, // ✅ hash real
        role: "subscriber",
        status: "active",
      },
    ],
    { ignoreDuplicates: true },
  );

  // Perfiles opcionales
  if (UserProfile) {
    await UserProfile.bulkCreate(
      [
        {
          user_id: users[0].id, // admin
          phone: "+59890000000",
          city: "Montevideo",
          country: "Uruguay",
        },
        {
          user_id: users[1].id, // Juan
          phone: "+59890000001",
          city: "Montevideo",
          country: "Uruguay",
        },
        {
          user_id: users[2].id, // Ana
          phone: "+59890000002",
          city: "Canelones",
          country: "Uruguay",
        },
      ],
      { ignoreDuplicates: true },
    );
  }

  console.log("Seeder de Users ejecutado correctamente.");
}

module.exports = { seedUsers };
