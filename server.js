// server.js
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/kk_coffe_shop', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(express.json());

// Routes
app.use('/', productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
