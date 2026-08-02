const Store = require('../models/Store');
const StoreAssortment = require('../models/StoreAssortment');
const StockReport = require('../models/StockReport'); // 👈 1. Agregamos esta importación

// GET /api/repositor/assigned-products/:storeId
// Obtiene la plantilla de productos obligatorios para la sucursal donde está el repositor
exports.getAssignedProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    // 1. Buscamos la sucursal para obtener su cadena y formato
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }

    // 2. Buscamos la plantilla que coincida con la Cadena y Formato de la sucursal
    const assortment = await StoreAssortment.findOne({
      chain: store.chain,
      format: store.format
    }).populate('products'); // Trae la info completa de los productos (EAN, nombre, marca, etc.)

    if (!assortment) {
      return res.status(404).json({ 
        message: `No existe una plantilla de surtido para ${store.chain} (${store.format})` 
      });
    }

    return res.status(200).json({
      store: {
        id: store._id,
        name: store.name,
        chain: store.chain,
        format: store.format
      },
      brandScope: assortment.brandScope,
      products: assortment.products
    });

  } catch (error) {
    return res.status(500).json({ 
      message: 'Error al obtener el surtido asignado', 
      error: error.message 
    });
  }
};

// 👈 2. Agregamos esta nueva función al final del archivo
// POST /api/repositor/report
// Guarda la lista completa tildada desde el front
exports.createReport = async (req, res) => {
  try {
    const { storeId, items, observaciones } = req.body;

    if (!storeId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
        message: 'Debes enviar la sucursal y la lista de productos relevados' 
      });
    }

    const newReport = new StockReport({
      store: storeId,
      repositor: req.user.id, // Viene descifrado desde el middleware JWT
      items, // Array con [{ product: ID, hayPresencia: true/false }]
      observaciones: observaciones || ''
    });

    await newReport.save();

    return res.status(201).json({
      message: 'Informe de sucursal guardado con éxito',
      reportId: newReport._id
    });

  } catch (error) {
    return res.status(500).json({ 
      message: 'Error al guardar el informe', 
      error: error.message 
    });
  }
};