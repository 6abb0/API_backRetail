const mongoose = require('mongoose');

const stockReportSchema = new mongoose.Schema({
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  repositor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Array con el estado de cada producto relevado en el checklist
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    hayPresencia: {
      type: Boolean,
      default: false // Si no lo tildó en el front, pasa como false (quiebre/faltante)
    },
    stockFisico: {
      type: Number,
      default: 0
    },
    precioGondola: {
      type: Number,
      default: 0
    }
  }],
  observaciones: {
    type: String,
    trim: true,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('StockReport', stockReportSchema);