const express = require('express');
const router = express.Router();
const supervisorController = require('../controllers/supervisorController');
const { verifyToken } = require('../middlewares/auth');

// GET /api/supervisor/reports - Consulta de auditorías
router.get('/reports', verifyToken, supervisorController.getReports);

module.exports = router;