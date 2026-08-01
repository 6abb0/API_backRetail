// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

// Importamos el middleware
const { verifyToken, checkRole } = require('../middlewares/auth');

// POST /products -> Crear un nuevo producto
router.post('/', verifyToken, checkRole('SUPERVISOR', 'ADMIN'), async (req, res) => {
  try {
    const { name, ean, brand, category, imageUrl } = req.body;

    const newProduct = new Product({
      name,
      ean,
      brand,
      category,
      imageUrl
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /products -> Listar todos los productos
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;