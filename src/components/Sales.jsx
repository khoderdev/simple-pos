import React, { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

function Sales() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders");
      const ordersWithProducts = await Promise.all(
        response.data.map(async (order) => {
          const itemsWithProducts = await Promise.all(
            order.items.map(async (item) => {
              const productResponse = await axios.get(
                `http://localhost:5000/products/${item.product}`
              );
              const product = productResponse.data;
              return { ...item, name: product.name, price: product.price };
            })
          );
          return { ...order, items: itemsWithProducts };
        })
      );
      setOrders(ordersWithProducts);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder((prevOrder) =>
      prevOrder && prevOrder._id === order._id ? null : order
    );
  };

  return (
    <MainLayout>
      <div className="sales-container">
        <h1>Sales</h1>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Total Amount</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <React.Fragment key={order._id}>
                <tr
                  onClick={() => handleRowClick(order)}
                  className={`order-row ${
                    selectedOrder && selectedOrder._id === order._id
                      ? "selected-order"
                      : ""
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>{order.totalAmount.toLocaleString()}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
                {selectedOrder && selectedOrder._id === order._id && (
                  <tr className="order-details-row">
                    <td colSpan="3">
                      <div className="order-details">
                        <h2>{`Order #${
                          orders.findIndex((o) => o._id === selectedOrder._id) +
                          1
                        }`}</h2>
                        <p className="fw-bold text-success">
                          Total Amount:{" "}
                          {selectedOrder.totalAmount.toLocaleString()}
                        </p>
                        <p>
                          Created at:{" "}
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                        <h3>Items:</h3>
                        <ol>
                          {selectedOrder.items.map((item, index) => (
                            <li key={index} className="item">
                              <p>
                                Name: <span>{item.name}</span>
                              </p>
                              <p>
                                Price:
                                <span> {item.price.toLocaleString()}</span>
                              </p>
                              <p>
                                Quantity: <span>{item.quantity}</span>
                              </p>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

export default Sales;
