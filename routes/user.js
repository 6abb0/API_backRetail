// routes/user.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs'); 

/* Middleware inline para verificar JWT */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del payload en req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

/* GET /user/me - Obtener el perfil del usuario autenticado */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/* PUT /user/me - Actualizar datos del usuario autenticado */
router.put('/me', verifyToken, async (req, res, next) => {
  try {
    const { email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { email } },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

/* 🆕 GET /user - Obtener lista de usuarios (filtrando por rol si se especifica) */
router.get('/', verifyToken, async (req, res, next) => {
  try {
    const { role } = req.query;
    
    // Filtro flexible: insensible a mayúsculas/minúsculas usando Regex o toUpperCase()
    const filter = role ? { role: new RegExp(`^${role}$`, 'i') } : {};

    const users = await User.find(filter).select('-password');

    res.json(users);
  } catch (error) {
    next(error);
  }
});

/* 🆕 POST /user/create-repositor - Registrar un nuevo repositor */
router.get('/repositores', verifyToken, async (req, res, next) => {}); // OPCIONAL

router.post('/create-repositor', verifyToken, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya se encuentra registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newRepositor = new User({
      name,
      email,
      password: hashedPassword,
      role: 'REPOSITOR' // Se asigna automáticamente el rol
    });

    await newRepositor.save();

    res.status(201).json({
      message: 'Repositor creado exitosamente',
      user: { id: newRepositor._id, name: newRepositor.name, email: newRepositor.email }
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;