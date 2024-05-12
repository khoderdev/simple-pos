import { useState, useEffect } from "react";
import axios from "axios";

function Sales() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://192.168.43.138:5000/orders");
      const ordersWithProducts = await Promise.all(
        response.data.map(async (order) => {
          const itemsWithProducts = await Promise.all(
            order.items.map(async (item) => {
              const productResponse = await axios.get(
                `http://192.168.43.138:5000/products/${item.product}`
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

  const handleFilter = async () => {
    try {
      const response = await axios.get("http://192.168.43.138:5000/orders");
      const ordersWithProducts = await Promise.all(
        response.data.map(async (order) => {
          const itemsWithProducts = await Promise.all(
            order.items.map(async (item) => {
              const productResponse = await axios.get(
                `http://192.168.43.138:5000/products/${item.product}`
              );
              const product = productResponse.data;
              return { ...item, name: product.name, price: product.price };
            })
          );
          return { ...order, items: itemsWithProducts };
        })
      );

      // Apply filtering based on selected dates
      const filteredOrders = ordersWithProducts.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          (!fromDate || orderDate >= fromDate) &&
          (!toDate || orderDate <= new Date(toDate.getTime() + 86400000))
        );
      });

      setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching or filtering orders:", error);
    }
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    fetchOrders();
  };

  return (
    <div className="sales-container flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Sales Dashboard</h1>

      {/* Date filters */}
      <div className="date-filter mb-16 flex justify-center items-center">
        <label className="text-lg font-semibold mr-4">From:</label>
        <input
          type="date"
          value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setFromDate(e.target.value ? new Date(e.target.value) : null)
          }
          className="rounded-md border border-gray-300 px-2 py-1 mr-4"
        />
        <label className="text-lg font-semibold mr-4">To:</label>
        <input
          type="date"
          value={toDate ? toDate.toISOString().split("T")[0] : ""}
          onChange={(e) =>
            setToDate(e.target.value ? new Date(e.target.value) : null)
          }
          className="rounded-md border border-gray-300 px-2 py-1 mr-4"
        />
        <div>
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Filter
          </button>
          {(fromDate || toDate) && (
            <button
              onClick={handleReset}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Orders */}
      <div className="accordion w-full font-medium md:w-1/2 border border-gray-900 p-2 bg-dark-blue rounded-md">
        {orders.map((order, index) => (
          <div
            key={order._id}
            className={`mb-8 ${
              selectedOrder && selectedOrder._id === order._id
                ? "border border-gray-900 rounded-md p-2"
                : ""
            }`}
          >
            <div
              onClick={() => handleRowClick(order)}
              className={`order-row cursor-pointer ${
                selectedOrder && selectedOrder._id === order._id
                  ? "selected-order"
                  : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <div>{`Order #${index + 1}`}</div>
                <div>{order.totalAmount.toLocaleString()} L.L</div>
                <div>{new Date(order.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {selectedOrder && selectedOrder._id === order._id && (
              <div className="order-details mt-4 bg-black-bg p-4 rounded-md">
                <p className="font-bold text-xl text-green-500">
                  Total Amount: {selectedOrder.totalAmount.toLocaleString()} L.L
                </p>
                <p className="text-gray-400">
                  Created at:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <h3 className="font-bold text-xl mt-2">Items:</h3>
                <ul>
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="item">
                      <p className="">Name: {item.name}</p>
                      <p>Price: {item.price.toLocaleString()} L.L</p>
                      <p>Quantity: {item.quantity}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sales;
