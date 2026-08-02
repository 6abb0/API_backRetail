const StockReport = require('../models/StockReport');

// GET /api/supervisor/reports
// Obtiene el listado de todos los reportes hechos por los repositores
exports.getReports = async (req, res) => {
  try {
    const { storeId } = req.query; // Permite filtrar si pasan ?storeId=xxx en la URL
    let filter = {};

    if (storeId) {
      filter.store = storeId;
    }

    const reports = await StockReport.find(filter)
      .populate('store', 'name chain format')
      .populate('repositor', 'name email')
      .populate('items.product', 'name ean brand')
      .sort({ createdAt: -1 }); // Muestra los más recientes primero

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ 
      message: 'Error al obtener los reportes de auditoría', 
      error: error.message 
    });
  }
};