const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./salesRoutes');
const tablesRouter = require('./salesRoutes');


const app = express();
const PORT = process.env.PORT || 5200;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/kk_coffe_shop', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); 
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/', productRoutes);
app.use('/', orderRoutes);
app.use("/tables", tablesRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
