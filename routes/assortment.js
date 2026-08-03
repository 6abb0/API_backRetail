const express = require('express');
const router = express.Router();
const StoreAssortment = require('../models/StoreAssortment');
const { verifyToken, checkRole } = require('../middlewares/auth');

// 📌 1. Crear una plantilla desde cero (POST /assortments)
router.post('/', verifyToken, checkRole('SUPERVISOR', 'ADMIN'), async (req, res) => {
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
    // 👈 ¡ESTA LÍNEA ES CLAVE! Imprime el motivo exacto en la consola donde corre Node
    console.error('❌ ERROR AL CREAR ASSORTMENT:', error);
    res.status(500).json({ error: error.message });
  }
});

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

// 📌 3. Obtener todas las plantillas (GET /assortments)
router.get('/', verifyToken, checkRole('SUPERVISOR', 'ADMIN'), async (req, res) => {
  try {
    const assortments = await StoreAssortment.find()
      .populate('products', 'name brand ean category imageUrl') // Trae la info detallada del producto
      .sort({ createdAt: -1 });

    res.status(200).json(assortments);
  } catch (error) {
    console.error('❌ ERROR AL OBTENER ASSORTMENTS:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;