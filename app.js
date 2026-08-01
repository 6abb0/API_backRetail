// Cargar variables de entorno (SIEMPRE en la primera línea)
require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./config/db');
const productsRouter = require('./routes/products');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const assortmentRouter = require('./routes/assortment'); // O assortments.js según como lo nombraste
const storesRouter = require('./routes/stores');

const app = express();

// Conectar a MongoDB
connectDB();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/auth', authRouter);
app.use('/assortments', assortmentRouter);
app.use('/stores', storesRouter);
app.use('/products', productsRouter);

module.exports = app;
