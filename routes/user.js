// routes/users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

/* GET /users/me - Obtener el perfil del usuario autenticado */
router.get('/me', verifyToken, async (req, res, next) => {
  try {
    // Excluimos la contraseña en la respuesta por seguridad
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/* PUT /users/me - Actualizar datos del usuario autenticado */
router.put('/me', verifyToken, async (req, res, next) => {
  try {
    const updates = req.body;
    
    // Evitamos que puedan modificar la contraseña directamente por esta ruta
    delete updates.password;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
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

module.exports = router;