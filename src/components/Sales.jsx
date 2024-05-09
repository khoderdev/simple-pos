import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Sales() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/orders');
            const ordersWithProducts = await Promise.all(response.data.map(async order => {
                const itemsWithProducts = await Promise.all(order.items.map(async item => {
                    const productResponse = await axios.get(`http://localhost:5000/products/${item.product}`);
                    const product = productResponse.data;
                    return { ...item, name: product.name, price: product.price }; // Add the product name and price to the item
                }));
                return { ...order, items: itemsWithProducts }; // Replace items with itemsWithProducts
            }));
            setOrders(ordersWithProducts);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div className="sales-container">
            <h1>Sales</h1>
            <div className="orders-list">
                {orders.map((order, index) => (
                    <div key={order._id} className="order-item">
                        <h2>Order #{index + 1}</h2>
                        <p className='fw-bold text-success'>Total Amount: {order.totalAmount}</p>
                        <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                        <h3>Items:</h3>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index} className="item">
                                    <p>Name: {item.name}</p>
                                    <p>Price: {item.price.toLocaleString()}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Sales;
