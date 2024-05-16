// 

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true
    },
    tableId: {
        type: String, // Assuming tableId is a string, adjust the type if necessary
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
