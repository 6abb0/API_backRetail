// models/Store.js (La sucursal física)
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // ej: "Coto Sucursal 108 - Abasto"
  chain: { type: String, required: true }, // "Coto"
  format: { 
    type: String, 
    required: true, 
    enum: ['HIPER', 'SUPER', 'MINI', 'EXPRESS', 'NEIGHBORHOOD', 'MAYORISTA'] 
  },
  address: String,

  // PRODUCTOS DADOS DE BAJA SOLO EN ESTA SUCURSAL
  // Guardamos las referencias a los IDs de los productos deshabilitados
  blacklistedProducts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);