// src/controllers/servicesController.js

const servicesController = {
  /* ==============================
   * PUBLIC
   * ============================== */

  // GET /api/services
  async listPublicServices(req, res) {
    try {
      const models = req.app.get("models");
      const { Service } = models;
      const { type, status } = req.query;

      const where = {};

      // Solo mostramos activos por defecto
      where.status = status || "active";

      if (type) {
        where.type = type; // "Curso" | "Taller"
      }

      const services = await Service.findAll({ where });

      res.json(services);
    } catch (error) {
      console.error("Error listPublicServices:", error);
      res.status(500).json({ message: "Error al obtener servicios" });
    }
  },

  // GET /api/services/:id
  async getServiceById(req, res) {
    try {
      const models = req.app.get("models");
      const { Service } = models;
      const { id } = req.params;

      const service = await Service.findByPk(id);

      if (!service || service.status === "inactive") {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }

      res.json(service);
    } catch (error) {
      console.error("Error getServiceById:", error);
      res.status(500).json({ message: "Error al obtener servicio" });
    }
  },

  /* ==============================
   * CLIENTE AUTENTICADO
   * ============================== */

  // POST /api/services/:id/enroll
  async enrollInService(req, res) {
    try {
      const models = req.app.get("models");
      const { Service, ServiceEnrollment } = models;
      const userId = req.user.id;
      const { id: serviceId } = req.params;

      const service = await Service.findByPk(serviceId);

      if (!service || service.status !== "active") {
        return res.status(404).json({ message: "Servicio no disponible" });
      }

      // Verificar si ya está inscripto (no cancelado)
      const existing = await ServiceEnrollment.findOne({
        where: {
          user_id: userId,
          service_id: serviceId,
        },
      });

      if (existing && existing.status !== "cancelled") {
        return res.status(400).json({ message: "Ya estás inscripto en este servicio" });
      }

      const enrollment = await ServiceEnrollment.create({
        user_id: userId,
        service_id: serviceId,
        status: "pending",
        notes: req.body.notes || null,
      });

      // opcional: actualizar contador de students_count
      await service.update({
        students_count: service.students_count + 1,
      });

      res.status(201).json({
        message: "Inscripción creada correctamente",
        enrollment,
      });
    } catch (error) {
      console.error("Error enrollInService:", error);
      res.status(500).json({ message: "Error al inscribirse al servicio" });
    }
  },

  // GET /api/services/me/enrollments
  async listMyEnrollments(req, res) {
    try {
      const models = req.app.get("models");
      const { ServiceEnrollment, Service } = models;
      const userId = req.user.id;

      const enrollments = await ServiceEnrollment.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Service,
            as: "service",
          },
        ],
      });

      res.json(enrollments);
    } catch (error) {
      console.error("Error listMyEnrollments:", error);
      res.status(500).json({
        message: "Error al obtener inscripciones del usuario",
      });
    }
  },

  /* ==============================
   * ADMIN
   * ============================== */

  // POST /api/services/admin
  async createService(req, res) {
    try {
      const models = req.app.get("models");
      const { Service } = models;

      const service = await Service.create(req.body);

      res.status(201).json(service);
    } catch (error) {
      console.error("Error createService:", error);
      res.status(500).json({ message: "Error al crear servicio" });
    }
  },

  // PUT /api/services/admin/:id
  async updateService(req, res) {
    try {
      const models = req.app.get("models");
      const { Service } = models;
      const { id } = req.params;

      const service = await Service.findByPk(id);
      if (!service) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }

      await service.update(req.body);

      res.json(service);
    } catch (error) {
      console.error("Error updateService:", error);
      res.status(500).json({ message: "Error al actualizar servicio" });
    }
  },

  // DELETE /api/services/admin/:id
  async deleteService(req, res) {
    try {
      const models = req.app.get("models");
      const { Service } = models;
      const { id } = req.params;

      const service = await Service.findByPk(id);
      if (!service) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }

      // Mejor dejar soft-delete cambiando el status a "inactive"
      await service.update({ status: "inactive" });

      res.json({ message: "Servicio marcado como inactivo" });
    } catch (error) {
      console.error("Error deleteService:", error);
      res.status(500).json({ message: "Error al eliminar servicio" });
    }
  },

  // GET /api/services/admin/:id/enrollments
  async listServiceEnrollments(req, res) {
    try {
      const models = req.app.get("models");
      const { Service, ServiceEnrollment, User } = models;
      const { id: serviceId } = req.params;

      const service = await Service.findByPk(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Servicio no encontrado" });
      }

      const enrollments = await ServiceEnrollment.findAll({
        where: { service_id: serviceId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "firstname", "lastname", "email"],
          },
        ],
      });

      res.json({
        service,
        enrollments,
      });
    } catch (error) {
      console.error("Error listServiceEnrollments:", error);
      res.status(500).json({
        message: "Error al obtener inscripciones del servicio",
      });
    }
  },
};

module.exports = servicesController;
