// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ean: { type: String, required: true, unique: true, trim: true }, // Código de barras
  brand: { type: String, required: true }, // Marca (ej: "Arcor", "Coca-Cola")
  category: String, // opcional (ej: "Bebidas", "Almacén")
  imageUrl: String // Queda el campo listo para más adelante
}, { timestamps: true });

module.exports = mongoose.model('Products', productSchema);