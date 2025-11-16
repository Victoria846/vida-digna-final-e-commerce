// src/seeders/Service/serviceSeeder.js
async function seedServices(models) {
  const { Service, ServiceEnrollment, User } = models;

  const serviceCount = await Service.count();
  if (serviceCount > 0) {
    console.log("Services ya tienen datos, se salta seeder de Services.");
    return;
  }

  const servicesData = [
    {
      id: 1,
      title: "Curso de Compostaje Básico",
      type: "Curso",
      duration: "4 semanas",
      price: 50.0,
      students_count: 234,
      status: "active",
    },
    {
      id: 2,
      title: "Taller de Reciclaje Creativo",
      type: "Taller",
      duration: "1 día",
      price: 30.0,
      students_count: 89,
      status: "active",
    },
    {
      id: 3,
      title: "Curso Avanzado de Sostenibilidad",
      type: "Curso",
      duration: "8 semanas",
      price: 120.0,
      students_count: 156,
      status: "active",
    },
    {
      id: 4,
      title: "Taller de Huertos Urbanos",
      type: "Taller",
      duration: "2 días",
      price: 45.0,
      students_count: 67,
      status: "draft",
    },
  ];

  await Service.bulkCreate(servicesData, { ignoreDuplicates: true });

  // Inscripciones de ejemplo
  if (ServiceEnrollment && User) {
    const user1 = await User.findByPk(1);
    const user2 = await User.findByPk(2);

    const enrollments = [];

    if (user1) {
      enrollments.push(
        {
          user_id: user1.id,
          service_id: 1,
          status: "confirmed",
          notes: "Interesado en compostaje básico",
        },
        {
          user_id: user1.id,
          service_id: 2,
          status: "pending",
        },
      );
    }

    if (user2) {
      enrollments.push({
        user_id: user2.id,
        service_id: 3,
        status: "confirmed",
        notes: "Inscripción a curso avanzado",
      });
    }

    if (enrollments.length > 0) {
      await ServiceEnrollment.bulkCreate(enrollments, {
        ignoreDuplicates: true,
      });
    }
  }

  console.log("Seeder de Services ejecutado.");
}

module.exports = { seedServices };
