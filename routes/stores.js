// routes/stores.js
const express = require('express');
const router = express.Router();

// Importamos los modelos
const Store = require('../models/Store');
const StoreAssortment = require('../models/StoreAssortment');

// Importamos los middlewares de autenticación y roles
const { verifyToken, checkRole } = require('../middlewares/auth');

// 🔒 POST /stores -> Crear una nueva sucursal física
// PROTEGIDO: Solo SUPERVISOR o ADMIN
router.post('/', verifyToken, checkRole('SUPERVISOR', 'ADMIN'), async (req, res) => {
  try {
    const { name, chain, format, address, blacklistedProducts } = req.body;

    const newStore = new Store({
      name,
      chain,
      format,
      address,
      blacklistedProducts: blacklistedProducts || []
    });

    await newStore.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔒 GET /stores/:storeId/products -> Lista de productos de la sucursal
// PROTEGIDO: Cualquier usuario logueado (Repositor, Supervisor, Admin)
router.get('/:storeId/products', verifyToken, async (req, res) => {
  try {
    const { storeId } = req.params;

    // 1. Buscamos la sucursal por su ID
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }

    // 2. Buscamos la plantilla base según Cadena y Formato
    const assortment = await StoreAssortment.findOne({ 
      chain: store.chain, 
      format: store.format 
    }).populate('products');

    if (!assortment) {
      return res.status(404).json({ 
        message: `No existe una plantilla para ${store.chain} (${store.format})` 
      });
    }

    // Convertimos los IDs excluidos a Strings para comparar fácilmente
    const excludedIds = store.blacklistedProducts.map(id => id.toString());

    // 3. Filtramos la lista removiendo los productos de la lista negra
    const finalProducts = assortment.products.filter(product => 
      !excludedIds.includes(product._id.toString())
    );

    res.json({
      store: store.name,
      chain: store.chain,
      format: store.format,
      totalProducts: finalProducts.length,
      products: finalProducts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;