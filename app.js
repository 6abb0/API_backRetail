const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors'); // 👈 Importamos CORS
require('dotenv').config(); // 👈 TIENE QUE SER LA LÍNEA 1

const connectDB = require('./config/db');

// Importar Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const assortmentRouter = require('./routes/assortment');
const storesRouter = require('./routes/stores');
const productsRouter = require('./routes/products.js');
const repositorRoutes = require('./routes/repositor');
const supervisorRoutes = require('./routes/supervisor');

const app = express();

// Conectar a MongoDB
connectDB();
app.use(cors());
// --- MIDDLEWARES BASE ---
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ⚠️ CORS SIEMPRE TIENE QUE IR ANTES DE CUALQUIER RUTA ⚠️
app.use(cors());

// --- DEFINICIÓN DE RUTAS ---
app.use('/', indexRouter);
app.use('/auth', authRouter); // 👈 Esta responderá en http://localhost:3000/auth/login
app.use('/user', usersRouter);
app.use('/assortments', assortmentRouter);
app.use('/stores', storesRouter);
app.use('/products', productsRouter);
app.use('/api/repositor', repositorRoutes);
app.use('/api/supervisor', supervisorRoutes);

module.exports = app;