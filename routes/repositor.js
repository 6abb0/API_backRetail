const express = require('express');
const router = express.Router();
const repositorController = require('../controllers/repositorController');
const { verifyToken } = require('../middlewares/auth'); // Middleware JWT
const AssignedRoute = require('../models/AssignedRoute');

// 💡 Mapeo de días (Declarado una sola vez en el scope global)
const DAYS_MAP = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

// 1. GET: Obtener hoja de ruta asignada únicamente para el día de HOY
router.get('/stores', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    const todayIndex = new Date().getDay();
    const todayName = DAYS_MAP[todayIndex]; // Ej: "LUNES"

    // Populamos únicamente 'assortment' evitando strictPopulate error
    const assignedRoutes = await AssignedRoute.find({
      repositor: userId,
      dia: new RegExp(`^${todayName}$`, 'i')
    }).populate('assortment');

    // Mapeamos los datos de las plantillas asignadas
    const todayStores = assignedRoutes
      .map((route) => {
        const assortment = route.assortment;
        if (!assortment) return null;

        return {
          _id: assortment._id,
          name: assortment.name || assortment.nombre || assortment.title || 'Plantilla de Surtido',
          address: assortment.type ? `Tipo: ${assortment.type}` : 'Sucursal asignada'
        };
      })
      .filter(Boolean);

    res.json({
      day: todayName,
      stores: todayStores
    });

  } catch (error) {
    console.error('❌ Error en GET /api/repositor/stores:', error);
    res.status(500).json({ 
      message: 'No se pudo obtener la hoja de ruta asignada para hoy.', 
      error: error.message 
    });
  }
});

// 2. GET: Obtener los productos que el repositor debe controlar en esta sucursal
router.get('/assigned-products/:storeId', verifyToken, repositorController.getAssignedProducts);

// 3. POST: Guarda el reporte/informe completo enviado por el repositor
router.post('/report', verifyToken, repositorController.createReport);

module.exports = router;