const express = require('express');
const router = express.Router();
const StoreAssortment = require('../models/StoreAssortment');
const { verifyToken, checkRole } = require('../middlewares/auth');


// POST /api/assortments/clone
router.post('/clone', verifyToken, checkRole('SUPERVISOR', 'ADMIN'), async (req, res) => {
  try {
    const { sourceAssortmentId, newChain, newFormat } = req.body;

    // 1. Buscamos la plantilla original
    const original = await StoreAssortment.findById(sourceAssortmentId);
    if (!original) {
      return res.status(404).json({ message: 'Plantilla de origen no encontrada' });
    }

    // 2. Creamos la nueva plantilla COPIANDO el arreglo de IDs de productos
    const newAssortment = await StoreAssortment.create({
      chain: newChain,
      format: newFormat,
      brandScope: original.brandScope,
      products: [...original.products] // Copiamos las referencias
    });

    res.status(201).json({
      message: 'Plantilla duplicada exitosamente',
      assortment: newAssortment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;