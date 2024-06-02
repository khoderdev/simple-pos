// productModel.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

// // productModel.js
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: String,
//     price: Number,
//     image: String,
// });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;
