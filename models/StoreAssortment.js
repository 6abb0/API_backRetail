// models/StoreAssortment.js
const mongoose = require('mongoose');

const storeAssortmentSchema = new mongoose.Schema({
  chain: { 
    type: String, 
    required: true 
  }, // ej: "Carrefour", "Coto", "Dia"
  
  format: { 
    type: String, 
    required: true, 
    enum: ['MAYORISTA','HIPER', 'SUPER', 'MINI', 'EXPRESS', 'NEIGHBORHOOD'] 
  }, // Formato / Tamaño
  
  brandScope: { 
    type: String, 
    required: true 
  }, // La marca comercial que representa (ej: "Arcor")

  // Arreglo con las referencias (IDs) a los productos que corresponden a esta plantilla
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { timestamps: true });

// Evita que el supervisor cree dos plantillas duplicadas para la misma Cadena + Formato + Marca
storeAssortmentSchema.index({ chain: 1, format: 1, brandScope: 1 }, { unique: true });

module.exports = mongoose.model('StoreAssortment', storeAssortmentSchema);