const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const { verifyToken } = require('../middlewares/auth');
const AssignedRoute = require('../models/AssignedRoute');
const bcrypt = require('bcryptjs'); // Usar bcryptjs en lugar de bcrypt
const User = require('../models/User');

// GET /api/supervisor/reports - Consulta de auditorías
router.get('/reports', verifyToken, supervisorController.getReports);

// 👤 Crear un nuevo Repositor
router.post('/repositor', verifyToken, async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // 1. Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // 2. Crear usuario pasando 'password' directamente
    // (El pre-save hook de tu userSchema se encarga del hashing)
    const newUser = await User.create({
      email,
      password, 
      role: (role || 'REPOSITOR').toUpperCase()
    });

    res.status(201).json({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });

  } catch (error) {
    console.error('Error al crear repositor:', error);
    res.status(500).json({ message: error.message });
  }
});

// 📋 1. Obtener todas las rutas asignadas
router.get('/routes', async (req, res) => {
  try {
    const routes = await AssignedRoute.find()
      .populate('repositor', 'name email nombre')
      .populate('assortment', 'chain format brandScope');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➕ 2. Asignar nueva ruta a repositor
router.post('/assign-route', async (req, res) => {
  try {
    const { repositorId, assortmentId, dia } = req.body;

    if (!repositorId || !assortmentId || !dia) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newAssignment = await AssignedRoute.create({
      repositor: repositorId,
      assortment: assortmentId,
      dia
    });

    res.status(201).json({ message: 'Ruta asignada con éxito', assignment: newAssignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🗑️ 3. Eliminar asignación
router.delete('/assign-route/:id', async (req, res) => {
  try {
    await AssignedRoute.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asignación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;