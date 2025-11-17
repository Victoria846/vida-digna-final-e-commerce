const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { generateToken } = require("../helpers/jwt");

const usersController = {
  /* ==============================
   * AUTH
   * ============================== */

  // POST /api/users/auth/register
  async register(req, res) {
    try {
      const models = req.app.get("models");
      const { User, UserProfile } = models;

      const { firstname, lastname, email, password } = req.body;

      if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({
          message: "Debe enviar firstname, lastname, email y password",
        });
      }

      // Verificar si ya existe
      const exists = await User.findOne({ where: { email } });
      if (exists) {
        return res.status(400).json({ message: "El email ya está registrado" });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstname,
        lastname,
        email,
        password: hashed,
        role: "client",
        status: "active",
      });

      await UserProfile.create({
        user_id: user.id,
      });

      res.status(201).json({
        message: "Usuario registrado correctamente",
        user: {
          id: user.id,
          firstname,
          lastname,
          email,
        },
      });
    } catch (error) {
      console.error("Error register:", error);
      res.status(500).json({ message: "Error al registrar usuario" });
    }
  },

  // POST /api/users/auth/login
  async login(req, res) {
    try {
      const models = req.app.get("models");
      const { User } = models;

      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Debe enviar email y password" });
      }

      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      // DEBUG: ver qué rol hay en la DB
      console.log("[login] role en DB:", user.role);

      // Rol efectivo
      let role = user.role;

      // Si no hay rol en la DB, forzamos uno
      if (!role) {
        if (user.email === "admin@example.com") {
          role = "admin";
        } else {
          role = "client";
        }
      }

      console.log("[login] role final que va al token:", role);

      // Firmamos el token con el rol ya corregido
      const token = generateToken({
        id: user.id,
        email: user.email,
        role,
      });

      res.json({
        message: "Login correcto",
        token,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role,
        },
      });
    } catch (error) {
      console.error("Error login:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  },

  /* ==============================
   * USER PROFILE
   * ============================== */

  // GET /api/users/me
  async getMe(req, res) {
    try {
      const models = req.app.get("models");
      const { User, UserProfile } = models;

      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        attributes: ["id", "firstname", "lastname", "email", "role", "status"],
        include: [{ model: UserProfile, as: "profile" }],
      });

      res.json(user);
    } catch (error) {
      console.error("Error getMe:", error);
      res.status(500).json({ message: "Error al obtener datos del usuario" });
    }
  },

  // PUT /api/users/me
  async updateMe(req, res) {
    try {
      const models = req.app.get("models");
      const { User, UserProfile } = models;

      const userId = req.user.id;
      const { firstname, lastname, email, phone, city, country } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (email) {
        const exists = await User.findOne({
          where: {
            email,
            id: { [Op.ne]: userId },
          },
        });

        if (exists) {
          return res.status(400).json({ message: "El email ya está en uso" });
        }
      }

      // Update user
      await user.update({
        firstname: firstname ?? user.firstname,
        lastname: lastname ?? user.lastname,
        email: email ?? user.email,
      });

      // Update profile
      const profile = await UserProfile.findOne({
        where: { user_id: userId },
      });

      if (profile) {
        await profile.update({
          phone: phone ?? profile.phone,
          city: city ?? profile.city,
          country: country ?? profile.country,
        });
      }

      res.json({ message: "Perfil actualizado correctamente" });
    } catch (error) {
      console.error("Error updateMe:", error);
      res.status(500).json({ message: "Error al actualizar perfil" });
    }
  },

  /* ==============================
   * ADMIN
   * ============================== */

  // GET /api/users/admin
  async listUsers(req, res) {
    try {
      const models = req.app.get("models");
      const { User, UserProfile } = models;

      const users = await User.findAll({
        include: [{ model: UserProfile, as: "profile" }],
        order: [["created_at", "DESC"]],
      });

      res.json(users);
    } catch (error) {
      console.error("Error listUsers:", error);
      res.status(500).json({ message: "Error al obtener la lista de usuarios" });
    }
  },

  // GET /api/users/admin/:id
  async getUserById(req, res) {
    try {
      const models = req.app.get("models");
      const { User, UserProfile } = models;
      const { id } = req.params;

      const user = await User.findByPk(id, {
        include: [{ model: UserProfile, as: "profile" }],
      });

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error getUserById:", error);
      res.status(500).json({ message: "Error al obtener usuario" });
    }
  },

  // PUT /api/users/admin/:id
  async updateUserByAdmin(req, res) {
    try {
      const models = req.app.get("models");
      const { User, UserProfile } = models;
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      const { firstname, lastname, email, role, status } = req.body;

      // check email duplication
      if (email) {
        const exists = await User.findOne({
          where: {
            email,
            id: { [Op.ne]: id },
          },
        });

        if (exists) {
          return res.status(400).json({ message: "El email ya está en uso" });
        }
      }

      await user.update({
        firstname: firstname ?? user.firstname,
        lastname: lastname ?? user.lastname,
        email: email ?? user.email,
        role: role ?? user.role,
        status: status ?? user.status,
      });

      const profile = await UserProfile.findOne({ where: { user_id: id } });

      if (profile) {
        await profile.update(req.body);
      }

      res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
      console.error("Error updateUserByAdmin:", error);
      res.status(500).json({ message: "Error al actualizar usuario" });
    }
  },

  // DELETE /api/users/admin/:id
  async deleteUser(req, res) {
    try {
      const models = req.app.get("models");
      const { User } = models;
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Soft delete
      await user.update({ status: "deleted" });

      res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error deleteUser:", error);
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  },
};

module.exports = usersController;
