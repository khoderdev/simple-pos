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
