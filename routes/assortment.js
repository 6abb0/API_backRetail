const express = require('express');
const router = express.Router();
const StoreAssortment = require('../models/StoreAssortment');
const Product = require('../models/Products');
const { verifyToken, checkRole } = require('../middlewares/auth');

// 📌 1. Crear una plantilla desde cero (POST /assortments)
router.post('/', verifyToken, checkRole('SUPERVISOR', 'ADMIN', 'supervisor', 'admin'), async (req, res) => {
  try {
    const { chain, format, brandScope, products } = req.body;

    if (!chain || !format || !brandScope || !products || !products.length) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newAssortment = await StoreAssortment.create({
      chain,
      format,
      brandScope,
      products
    });

    res.status(201).json({
      message: 'Plantilla creada exitosamente',
      assortment: newAssortment
    });
  } catch (error) {
    console.error('❌ ERROR AL CREAR ASSORTMENT:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ya existe una plantilla para esa Cadena, Formato y Marca.' });
    }
    res.status(500).json({ error: error.message });
  }
});

// 📌 2. Clonar plantilla (POST /assortments/clone)
router.post('/clone', verifyToken, checkRole('SUPERVISOR', 'ADMIN', 'supervisor', 'admin'), async (req, res) => {
  try {
    const { sourceAssortmentId, newChain, newFormat } = req.body;

    const original = await StoreAssortment.findById(sourceAssortmentId);
    if (!original) {
      return res.status(404).json({ message: 'Plantilla de origen no encontrada' });
    }

    const newAssortment = await StoreAssortment.create({
      chain: newChain,
      format: newFormat,
      brandScope: original.brandScope,
      products: [...original.products]
    });

    res.status(201).json({
      message: 'Plantilla duplicada exitosamente',
      assortment: newAssortment
    });
  } catch (error) {
    console.error('❌ ERROR AL CLONAR ASSORTMENT:', error);
    res.status(500).json({ error: error.message });
  }
});

// 📌 3. Obtener todas las plantillas (GET /assortments)
router.get('/', verifyToken, checkRole('SUPERVISOR', 'ADMIN', 'supervisor', 'admin'), async (req, res) => {
  try {
    const assortments = await StoreAssortment.find()
      .populate('products', 'name brand ean category imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(assortments);
  } catch (error) {
    console.error('❌ ERROR AL OBTENER ASSORTMENTS:', error);
    res.status(500).json({ 
      error: 'Error al obtener las plantillas',
      details: error.message 
    });
  }
});

module.exports = router;