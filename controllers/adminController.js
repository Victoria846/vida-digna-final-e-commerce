const { Admin } = require("../models");
const { bcrypt } = require("bcrypt");
const { Model, DataTypes } = require("sequelize");

async function index(req, res) {
  try {
    const admins = await Admin.findAll();
    return res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los administradores" });
  }
}

async function show(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener el administrador" });
  }
}

async function store(req, res) {
  try {
    const { firstname, lastname, role, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      firstname,
      lastname,
      role,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({ message: "Admin creado", admin: newAdmin });
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el administrador" });
  }
}

async function update(req, res) {
  try {
    const { id } = req.params;
    const { firstname, lastname, role, email, password } = req.body;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado" });
    }
    let updatedData = { firstname, lastname, role, email };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }
    await admin.update(updatedData);
    return res.status(200).json({ message: "Admin actualizado", admin });
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el administrador" });
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin no encontrado" });
    }
    await admin.destroy();
    return res.status(200).json({ message: "Admin eliminado" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el admin" });
  }
}

class AdminLog extends Model {
  static initModel(sequelize) {
    AdminLog.init(
      { action: DataTypes.STRING },
      {
        sequelize,
        modelName: "adminlog",
        timestamps: true,
      },
    );
    return AdminLog;
  }
  static associate(models) {
    AdminLog.belongsTo(models.Admin, { foreignKey: "adminId", as: "admin" });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  AdminLog,
};
