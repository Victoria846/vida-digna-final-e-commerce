// src/seeders/User/userSeeder.js
async function seedUsers(models) {
  const { User, UserProfile, Admin } = models;

  const userCount = await User.count();
  if (userCount > 0) {
    console.log("Users ya tienen datos, se salta seeder de Users.");
    return;
  }

  // Usuarios base
  const users = await User.bulkCreate(
    [
      {
        id: 1,
        firstname: "Juan",
        lastname: "Pérez",
        email: "juan@example.com",
        password: "hashed_password_juan",
        role: "client",
        status: "active",
      },
      {
        id: 2,
        firstname: "Ana",
        lastname: "García",
        email: "ana@example.com",
        password: "hashed_password_ana",
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
          user_id: 1,
          phone: "+59890000001",
          city: "Montevideo",
          country: "Uruguay",
        },
        {
          user_id: 2,
          phone: "+59890000002",
          city: "Canelones",
          country: "Uruguay",
        },
      ],
      { ignoreDuplicates: true },
    );
  }

  // Admin base
  if (Admin) {
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      await Admin.create({
        firstname: "Super",
        lastname: "Admin",
        email: "admin@example.com",
        password: "hashed_password_admin",
        role: "superadmin",
      });
    }
  }

  console.log("Seeder de Users ejecutado.");
}

module.exports = { seedUsers };
