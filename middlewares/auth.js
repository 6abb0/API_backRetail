// middlewares/auth.js
const jwt = require('jsonwebtoken');

// 1. Verificar si está logueado (Token válido)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // El header suele venir como: "Bearer token_super_largo..."
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: No se proporcionó un token' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Guardamos los datos del usuario en la petición (id, role, etc.)
    next(); // Continúa hacia la ruta
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

// 2. Verificar Roles (Ej: Solo SUPERVISOR o ADMIN)
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tenés permisos suficientes para realizar esta acción' 
      });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };