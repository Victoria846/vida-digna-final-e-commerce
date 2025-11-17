// scripts/setAdmin.js
const db = require("../models");

async function setAdmin() {
  const { User } = db;

  const email = "admin@example.com"; // 👈 cámbialo

  const user = await User.findOne({ where: { email } });
  if (!user) {
    console.error("No encontré usuario con ese email");
    process.exit(1);
  }

  user.role = "admin";
  await user.save();

  console.log("Listo, usuario ahora es admin:", user.email);
  process.exit(0);
}

setAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
