const express = require('express');
const router = express.Router();
const repositorController = require('../controllers/repositorController');
const { verifyToken } = require('../middlewares/auth'); // Tu middleware JWT

// Obtener los productos que el repositor debe controlar en esta sucursal
router.get('/assigned-products/:storeId', verifyToken, repositorController.getAssignedProducts);

// 2. POST: Guarda el reporte/informe completo enviado por el repositor
router.post('/report', verifyToken, repositorController.createReport);

module.exports = router;