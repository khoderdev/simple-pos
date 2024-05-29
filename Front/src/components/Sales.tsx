// // import { useState, useEffect } from "react";
// // import axios from "axios";

// // function Sales() {
// //   const [orders, setOrders] = useState([]);
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [fromDate, setFromDate] = useState(null);
// //   const [toDate, setToDate] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     fetchOrders();
// //     handleFilter();
// //   }, []);

// //   const fetchOrders = async () => {
// //     setLoading(true);
// //     try {
// //       const cachedOrders = localStorage.getItem("orders");
// //       if (cachedOrders) {
// //         setOrders(JSON.parse(cachedOrders));
// //       } else {
// //         const response = await axios.get("http://localhost:5000/orders");
// //         const ordersWithProducts = await Promise.all(
// //           response.data.map(async (order) => {
// //             const itemsWithProducts = await Promise.all(
// //               order.items.map(async (item) => {
// //                 const productResponse = await axios.get(
// //                   `http://localhost:5000/products/${item.product}`
// //                 );
// //                 const product = productResponse.data;
// //                 return { ...item, name: product.name, price: product.price };
// //               })
// //             );
// //             return { ...order, items: itemsWithProducts };
// //           })
// //         );
// //         setOrders(ordersWithProducts);
// //         localStorage.setItem("orders", JSON.stringify(ordersWithProducts));
// //       }
// //     } catch (error) {
// //       console.error("Error fetching orders:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleRowClick = (order) => {
// //     setSelectedOrder((prevOrder) =>
// //       prevOrder && prevOrder._id === order._id ? null : order
// //     );
// //   };

// //   const handleFilter = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get("http://localhost:5000/orders");
// //       const ordersWithProducts = await Promise.all(
// //         response.data.map(async (order) => {
// //           const itemsWithProducts = await Promise.all(
// //             order.items.map(async (item) => {
// //               const productResponse = await axios.get(
// //                 `http://localhost:5000/products/${item.product}`
// //               );
// //               const product = productResponse.data;
// //               return { ...item, name: product.name, price: product.price };
// //             })
// //           );
// //           return { ...order, items: itemsWithProducts };
// //         })
// //       );

// //       // Apply filtering based on selected dates
// //       const filteredOrders = ordersWithProducts.filter((order) => {
// //         const orderDate = new Date(order.createdAt);
// //         return (
// //           (!fromDate || orderDate >= fromDate) &&
// //           (!toDate || orderDate <= new Date(toDate.getTime() + 86400000))
// //         );
// //       });

// //       setOrders(filteredOrders);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Error fetching or filtering orders:", error);
// //       setLoading(false);
// //     }
// //   };

// //   const handleReset = () => {
// //     setFromDate(null);
// //     setToDate(null);
// //     fetchOrders();
// //   };

// //   return (
// //     <div className="sales-container flex flex-col items-center">
// //       <h1 className="text-3xl font-bold mb-6 text-center">Sales Dashboard</h1>

// //       {/* Date filters */}
// //       <div className="w-full md:w-auto md:flex md:flex-row md:gap-5 date-filter mb-4 text-center flex flex-col justify-center items-center">
// //         <label className="flex flex-col justify-center items-center text-xl text-blue-500 font-semibold mb-2">
// //           From:
// //           <input
// //             type="date"
// //             value={fromDate ? fromDate.toISOString().split("T")[0] : ""}
// //             onChange={(e) =>
// //               setFromDate(e.target.value ? new Date(e.target.value) : null)
// //             }
// //             className="text-white text-lg text-center rounded-md border border-gray-300 px-2 py-1 mb-2"
// //           />
// //         </label>
// //         <label className="flex flex-col text-xl font-semibold mb-2 text-blue-500">
// //           To:
// //           <input
// //             type="date"
// //             value={toDate ? toDate.toISOString().split("T")[0] : ""}
// //             onChange={(e) =>
// //               setToDate(e.target.value ? new Date(e.target.value) : null)
// //             }
// //             className="text-white text-lg text-center justify-center items-center rounded-md border border-gray-300 px-2 py-1 mb-2"
// //           />
// //         </label>
// //         <div className="flex w-full gap-2 items-center justify-around mt-2 px-10">
// //           <button
// //             onClick={handleFilter}
// //             className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
// //           >
// //             Filter
// //           </button>
// //           {(fromDate || toDate) && (
// //             <button
// //               onClick={handleReset}
// //               className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
// //             >
// //               Clear
// //             </button>
// //           )}
// //         </div>
// //       </div>

// //       {/* Orders */}
// //       {loading ? (
// //         <p>Loading...</p>
// //       ) : (
// //         <div className="accordion w-full font-medium lg:w-2/3 border border-gray-900 p-6 bg-dark-blue rounded-md">
// //           {orders.length === 0 ? (
// //             <p className="text-red text-xl text-center">
// //               No Orders at the selected dates
// //             </p>
// //           ) : (
// //             <>
// //               {/* Header titles */}
// //               <div className="grid grid-cols-4 text-blue-500 border-b border-gray-700 pb-3 mb-3">
// //                 <div className="text-lg font-bold">Order #</div>
// //                 <div className="text-lg font-bold">Total</div>
// //                 <div className="text-lg font-bold">Date</div>
// //                 <div className="text-lg font-bold">Status</div>
// //               </div>

// //               {/* Order rows */}
// //               {orders.map((order, index) => (
// //                 <div
// //                   key={order._id}
// //                   className={`mb-6 ${
// //                     selectedOrder && selectedOrder._id === order._id
// //                       ? "border bg-black-bg border-[#fe0039] rounded-md p-3"
// //                       : ""
// //                   }`}
// //                 >
// //                   <div
// //                     onClick={() => handleRowClick(order)}
// //                     className={`order-row cursor-pointer border-b border-gray-700 ${
// //                       selectedOrder && selectedOrder._id === order._id
// //                         ? "selected-order"
// //                         : ""
// //                     }`}
// //                   >
// //                     <div className="grid grid-cols-4 items-center">
// //                       <div className="text-lg">{index + 1}</div>
// //                       <div className="text-lg">
// //                         {order.totalAmount.toLocaleString()} L.L
// //                       </div>
// //                       <div className="text-lg">
// //                         {new Date(order.createdAt).toLocaleString()}
// //                       </div>
// //                       <div className="text-lg text-red text-left">
// //                         {order.status}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   {selectedOrder && selectedOrder._id === order._id && (
// //                     <div className="order-details mt-4 bg-black-bg p-4 rounded-md">
// //                       <p className="font-bold text-xl text-green-500 mb-1">
// //                         Total Amount:{" "}
// //                         {selectedOrder.totalAmount.toLocaleString()} L.L
// //                       </p>
// //                       <p className="text-gray-400 mb-4">
// //                         Created at:{" "}
// //                         {new Date(selectedOrder.createdAt).toLocaleString()}
// //                       </p>
// //                       <h3 className="font-bold text-xl my-2">Items:</h3>
// //                       <ul>
// //                         {selectedOrder.items.map((item, index) => (
// //                           <li key={index} className="item mb-2">
// //                             <p className="text-red">Item {index + 1}</p>
// //                             <p className="text-gray-400">
// //                               Name:{" "}
// //                               <span className="text-white ml-2">
// //                                 {item.name}
// //                               </span>
// //                             </p>
// //                             <p className="text-gray-400">
// //                               Price:{" "}
// //                               <span className="text-white ml-2">
// //                                 {item.price.toLocaleString()} L.L
// //                               </span>
// //                             </p>
// //                             <p className="text-gray-400">
// //                               Quantity:{" "}
// //                               <span className="text-white ml-2">
// //                                 {item.quantity}
// //                               </span>
// //                             </p>
// //                           </li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   )}
// //                 </div>
// //               ))}
// //             </>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // export default Sales;

// import { useState, useEffect } from "react";
// import axios from "axios";

// function Sales() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:5000/orders");
//       const ordersWithProducts = await Promise.all(
//         response.data.map(async (order) => {
//           const itemsWithProducts = await Promise.all(
//             order.items.map(async (item) => {
//               const productResponse = await axios.get(
//                 `http://localhost:5000/products/${item.product}`
//               );
//               const product = productResponse.data;
//               return { ...item, name: product.name, price: product.price };
//             })
//           );
//           return { ...order, items: itemsWithProducts };
//         })
//       );
//       setOrders(ordersWithProducts);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateReport = () => {
//     const filteredOrders = orders.filter((order) => {
//       const orderDate = new Date(order.createdAt);
//       const orderHour = orderDate.getHours();
//       return orderHour >= 3 && orderHour <= 21;
//     });

//     const totalSales = filteredOrders.reduce(
//       (total, order) => total + order.totalAmount,
//       0
//     );
//     const totalOrders = filteredOrders.length;

//     return (
//       <div className="report mt-6 p-4 bg-gray-800 text-white rounded-md">
//         <h2 className="text-2xl font-bold mb-4">
//           End of the Day Report (3:00 PM - 9:00 PM)
//         </h2>
//         <p className="mb-2">Total Sales: {totalSales.toLocaleString()} L.L</p>
//         <p className="mb-2">Total Orders: {totalOrders}</p>
//       </div>
//     );
//   };

//   const handleRowClick = (order) => {
//     setSelectedOrder((prevOrder) =>
//       prevOrder && prevOrder._id === order._id ? null : order
//     );
//   };

//   return (
//     <div className="sales-container flex flex-col items-center">
//       <h1 className="text-3xl font-bold mb-6 text-center">Sales Dashboard</h1>

//       {/* Orders */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="w-full font-medium lg:w-2/3 border border-gray-900 p-6 bg-dark-blue rounded-md">
//           {orders.length === 0 ? (
//             <p className="text-red text-xl text-center">No Orders found</p>
//           ) : (
//             <>
//               {/* Header titles */}
//               <div className="grid grid-cols-4 text-blue-500 border-b border-gray-700 pb-3 mb-3">
//                 <div className="text-lg font-bold">Order #</div>
//                 <div className="text-lg font-bold">Total</div>
//                 <div className="text-lg font-bold">Date</div>
//                 <div className="text-lg font-bold">Status</div>
//               </div>

//               {/* Order rows */}
//               {orders.map((order, index) => (
//                 <div
//                   key={order._id}
//                   className={`mb-6 ${
//                     selectedOrder && selectedOrder._id === order._id
//                       ? "border bg-black-bg border-[#fe0039] rounded-md p-3"
//                       : ""
//                   }`}
//                 >
//                   <div
//                     onClick={() => handleRowClick(order)}
//                     className={`order-row cursor-pointer border-b border-gray-700 ${
//                       selectedOrder && selectedOrder._id === order._id
//                         ? "selected-order"
//                         : ""
//                     }`}
//                   >
//                     <div className="grid grid-cols-4 items-center">
//                       <div className="text-lg">{index + 1}</div>
//                       <div className="text-lg">
//                         {order.totalAmount.toLocaleString()} L.L
//                       </div>
//                       <div className="text-lg">
//                         {new Date(order.createdAt).toLocaleString()}
//                       </div>
//                       <div className="text-lg text-red text-left">
//                         {order.status}
//                       </div>
//                     </div>
//                   </div>

//                   {selectedOrder && selectedOrder._id === order._id && (
//                     <div className="order-details mt-4 bg-black-bg p-4 rounded-md">
//                       <p className="font-bold text-xl text-green-500 mb-1">
//                         Total Amount:{" "}
//                         {selectedOrder.totalAmount.toLocaleString()} L.L
//                       </p>
//                       <p className="text-gray-400 mb-4">
//                         Created at:{" "}
//                         {new Date(selectedOrder.createdAt).toLocaleString()}
//                       </p>
//                       <h3 className="font-bold text-xl my-2">Items:</h3>
//                       <ul>
//                         {selectedOrder.items.map((item, index) => (
//                           <li key={index} className="item mb-2">
//                             <p className="text-red">Item {index + 1}</p>
//                             <p className="text-gray-400">
//                               Name:{" "}
//                               <span className="text-white ml-2">
//                                 {item.name}
//                               </span>
//                             </p>
//                             <p className="text-gray-400">
//                               Price:{" "}
//                               <span className="text-white ml-2">
//                                 {item.price.toLocaleString()} L.L
//                               </span>
//                             </p>
//                             <p className="text-gray-400">
//                               Quantity:{" "}
//                               <span className="text-white ml-2">
//                                 {item.quantity}
//                               </span>
//                             </p>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}

//       {/* End of the Day Report */}
//       {generateReport()}
//     </div>
//   );
// }

// export default Sales;


// import { useState, useEffect } from "react";
// import axios from "axios";

// function Sales() {
//   const [orders, setOrders] = useState([]);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [report, setReport] = useState(null); // New state variable for the report

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://localhost:5000/orders");
//       const ordersWithProducts = await Promise.all(
//         response.data.map(async (order) => {
//           const itemsWithProducts = await Promise.all(
//             order.items.map(async (item) => {
//               const productResponse = await axios.get(
//                 `http://localhost:5000/products/${item.product}`
//               );
//               const product = productResponse.data;
//               return { ...item, name: product.name, price: product.price };
//             })
//           );
//           return { ...order, items: itemsWithProducts };
//         })
//       );
//       setOrders(ordersWithProducts);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateReport = () => {
//     const filteredOrders = orders.filter((order) => {
//       const orderDate = new Date(order.createdAt);
//       const orderHour = orderDate.getHours();
//       return orderHour >= 3 && orderHour <= 12;
//     });

//     const totalSales = filteredOrders.reduce(
//       (total, order) => total + order.totalAmount,
//       0
//     );
//     const totalOrders = filteredOrders.length;

//     const newReport = (
//       <div className="report mt-6 p-4 bg-gray-800 text-white rounded-md">
//         <h2 className="text-2xl font-bold mb-4">
//           End of the Day Report (3:00 PM - 9:00 PM)
//         </h2>
//         <p className="mb-2">Total Sales: {totalSales.toLocaleString()} L.L</p>
//         <p className="mb-2">Total Orders: {totalOrders}</p>
//       </div>
//     );

//     setReport(newReport); // Store the generated report in the state
//   };

//   const handleRowClick = (order) => {
//     setSelectedOrder((prevOrder) =>
//       prevOrder && prevOrder._id === order._id ? null : order
//     );
//   };

//   return (
//     <div className="sales-container flex flex-col items-center">
//       <h1 className="text-3xl font-bold mb-6 text-center">Sales Dashboard</h1>
//       <button
//         onClick={generateReport}
//         className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-4"
//       >
//         End of the day
//       </button>
//       {/* Orders */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <div className="w-full font-medium lg:w-2/3 border border-gray-900 p-6 bg-dark-blue rounded-md">
//           {orders.length === 0 ? (
//             <p className="text-red text-xl text-center">No Orders found</p>
//           ) : (
//             <>
//               {/* Header titles */}
//               <div className="grid grid-cols-4 text-blue-500 border-b border-gray-700 pb-3 mb-3">
//                 <div className="text-lg font-bold">Order #</div>
//                 <div className="text-lg font-bold">Total</div>
//                 <div className="text-lg font-bold">Date</div>
//                 <div className="text-lg font-bold">Status</div>
//               </div>

//               {/* Order rows */}
//               {orders.map((order, index) => (
//                 <div
//                   key={order._id}
//                   className={`mb-6 ${
//                     selectedOrder && selectedOrder._id === order._id
//                       ? "border bg-black-bg border-[#fe0039] rounded-md p-3"
//                       : ""
//                   }`}
//                 >
//                   <div
//                     onClick={() => handleRowClick(order)}
//                     className={`order-row cursor-pointer border-b border-gray-700 ${
//                       selectedOrder && selectedOrder._id === order._id
//                         ? "selected-order"
//                         : ""
//                     }`}
//                   >
//                     <div className="grid grid-cols-4 items-center">
//                       <div className="text-lg">{index + 1}</div>
//                       <div className="text-lg">
//                         {order.totalAmount.toLocaleString()} L.L
//                       </div>
//                       <div className="text-lg">
//                         {new Date(order.createdAt).toLocaleString()}
//                       </div>
//                       <div className="text-lg text-red text-left">
//                         {order.status}
//                       </div>
//                     </div>
//                   </div>

//                   {selectedOrder && selectedOrder._id === order._id && (
//                     <div className="order-details mt-4 bg-black-bg p-4 rounded-md">
//                       <p className="font-bold text-xl text-green-500 mb-1">
//                         Total Amount:{" "}
//                         {selectedOrder.totalAmount.toLocaleString()} L.L
//                       </p>
//                       <p className="text-gray-400 mb-4">
//                         Created at:{" "}
//                         {new Date(selectedOrder.createdAt).toLocaleString()}
//                       </p>
//                       <h3 className="font-bold text-xl my-2">Items:</h3>
//                       <ul>
//                         {selectedOrder.items.map((item, index) => (
//                           <li key={index} className="item mb-2">
//                             <p className="text-red">Item {index + 1}</p>
//                             <p className="text-gray-400">
//                               Name:{" "}
//                               <span className="text-white ml-2">
//                                 {item.name}
//                               </span>
//                             </p>
//                             <p className="text-gray-400">
//                               Price:{" "}
//                               <span className="text-white ml-2">
//                                 {item.price.toLocaleString()} L.L
//                               </span>
//                             </p>
//                             <p className="text-gray-400">
//                               Quantity:{" "}
//                               <span className="text-white ml-2">
//                                 {item.quantity}
//                               </span>
//                             </p>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       )}

//       {/* End of the Day Report */}
//       {report}
//     </div>
//   );
// }

// export default Sales;



import { useState, useEffect } from "react";
import axios from "axios";

function Sales() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null); // State variable for the report
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const orderHour = orderDate.getHours();
      return orderHour >= 15 && orderHour <= 21;
    });

    const totalSales = filteredOrders.reduce(
      (total, order) => total + order.totalAmount,
      0
    );
    const totalOrders = filteredOrders.length;

    const newReport = (
      <div className="report p-4 bg-gray-800 text-white rounded-md">
        <h2 className="text-2xl font-bold mb-4">
          End of the Day Report (3:00 PM - 9:00 PM)
        </h2>
        <p className="mb-2">Total Sales: {totalSales.toLocaleString()} L.L</p>
        <p className="mb-2">Total Orders: {totalOrders}</p>
      </div>
    );

    setReport(newReport); // Store the generated report in the state
    setIsModalOpen(true); // Show the modal
  };

  const handleRowClick = (order) => {
    setSelectedOrder((prevOrder) =>
      prevOrder && prevOrder._id === order._id ? null : order
    );
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="sales-container flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Sales Dashboard</h1>
      <button
        onClick={generateReport}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mb-4"
      >
        End of the day
      </button>
      {/* Orders */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full font-medium lg:w-2/3 border border-gray-900 p-6 bg-dark-blue rounded-md">
          {orders.length === 0 ? (
            <p className="text-red text-xl text-center">No Orders found</p>
          ) : (
            <>
              {/* Header titles */}
              <div className="grid grid-cols-4 text-blue-500 border-b border-gray-700 pb-3 mb-3">
                <div className="text-lg font-bold">Order #</div>
                <div className="text-lg font-bold">Total</div>
                <div className="text-lg font-bold">Date</div>
                <div className="text-lg font-bold">Status</div>
              </div>

              {/* Order rows */}
              {orders.map((order, index) => (
                <div
                  key={order._id}
                  className={`mb-6 ${
                    selectedOrder && selectedOrder._id === order._id
                      ? "border bg-black-bg border-[#fe0039] rounded-md p-3"
                      : ""
                  }`}
                >
                  <div
                    onClick={() => handleRowClick(order)}
                    className={`order-row cursor-pointer border-b border-gray-700 ${
                      selectedOrder && selectedOrder._id === order._id
                        ? "selected-order"
                        : ""
                    }`}
                  >
                    <div className="grid grid-cols-4 items-center">
                      <div className="text-lg">{index + 1}</div>
                      <div className="text-lg">
                        {order.totalAmount.toLocaleString()} L.L
                      </div>
                      <div className="text-lg">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="text-lg text-red text-left">
                        {order.status}
                      </div>
                    </div>
                  </div>

                  {selectedOrder && selectedOrder._id === order._id && (
                    <div className="order-details mt-4 bg-black-bg p-4 rounded-md">
                      <p className="font-bold text-xl text-green-500 mb-1">
                        Total Amount:{" "}
                        {selectedOrder.totalAmount.toLocaleString()} L.L
                      </p>
                      <p className="text-gray-400 mb-4">
                        Created at:{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                      <h3 className="font-bold text-xl my-2">Items:</h3>
                      <ul>
                        {selectedOrder.items.map((item, index) => (
                          <li key={index} className="item mb-2">
                            <p className="text-red">Item {index + 1}</p>
                            <p className="text-gray-400">
                              Name:{" "}
                              <span className="text-white ml-2">
                                {item.name}
                              </span>
                            </p>
                            <p className="text-gray-400">
                              Price:{" "}
                              <span className="text-white ml-2">
                                {item.price.toLocaleString()} L.L
                              </span>
                            </p>
                            <p className="text-gray-400">
                              Quantity:{" "}
                              <span className="text-white ml-2">
                                {item.quantity}
                              </span>
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* End of the Day Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#070f1b] p-6 rounded-lg shadow-lg w-full max-w-xl mx-4 relative">
            <div
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            {report}
          </div>
        </div>
      )}
    </div>
  );
}

export default Sales;
