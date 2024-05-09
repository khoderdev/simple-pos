// productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    // Add more fields as needed
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
