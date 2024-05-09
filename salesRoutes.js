// // sales routes.js
// const express = require('express');
// const router = express.Router();
// const Product = require('./productModel');
// const Order = require('./salesModel');

// // GET all products
// router.get('/products', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // GET a single product
// router.get('/products/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (product) {
//             res.json(product);
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Create a new product
// router.post('/products/new', async (req, res) => {
//     const product = new Product({
//         name: req.body.name,
//         price: req.body.price,
//         image: req.body.image,
//     });

//     try {
//         const newProduct = await product.save();
//         res.status(201).json(newProduct);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // Update a product
// router.put('/products/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (product) {
//             product.name = req.body.name || product.name;
//             product.price = req.body.price || product.price;
//             product.image = req.body.image || product.image;

//             const updatedProduct = await product.save();
//             res.json(updatedProduct);
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Delete a product
// router.delete('/products/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (product) {
//             await product.remove();
//             res.json({ message: 'Product deleted' });
//         } else {
//             res.status(404).json({ message: 'Product not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Create a new order
// router.post('/orders/new', async (req, res) => {
//     const order = new Order({
//         items: req.body.items,
//         totalAmount: req.body.totalAmount
//     });

//     try {
//         const newOrder = await order.save();
//         res.status(201).json(newOrder);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // GET all orders
// router.get('/orders', async (req, res) => {
//     try {
//         const orders = await Order.find().sort({ createdAt: -1 });
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// module.exports = router;



// salesRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('./productModel');
const Order = require('./salesModel');

// Create a new order
router.post('/orders/new', async (req, res) => {
    try {
        // Extract items array from the request body
        const { items, totalAmount } = req.body;

        // Create an array to store order items
        const orderItems = [];

        // Loop through each item in the items array
        for (const item of items) {
            // Find the product in the database by its ID
            const product = await Product.findById(item.productId);

            // If the product is found, add it to the order items array
            if (product) {
                orderItems.push({
                    product: product._id, // Store the product ID
                    quantity: item.quantity,
                    totalAmount: item.price * item.quantity // Calculate the total amount for the item
                });
            } else {
                // If the product is not found, return an error response
                return res.status(404).json({ message: `Product with ID ${item.productId} not found` });
            }
        }

        // Create a new order with the order items array and total amount
        const order = new Order({
            items: orderItems,
            totalAmount
        });

        // Save the new order to the database
        const newOrder = await order.save();

        // Return a success response with the new order data
        res.status(201).json(newOrder);
    } catch (error) {
        // If an error occurs, return an error response
        res.status(400).json({ message: error.message });
    }
});

// GET all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
