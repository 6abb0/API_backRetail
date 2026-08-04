// models/AssignedRoute.js
const mongoose = require('mongoose');

const assignedRouteSchema = new mongoose.Schema({
  repositor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Nombre de tu modelo de usuarios
    required: true
  },
  assortment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StoreAssortment',
    required: true
  },
  dia: {
    type: String,
    enum: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AssignedRoute', assignedRouteSchema);