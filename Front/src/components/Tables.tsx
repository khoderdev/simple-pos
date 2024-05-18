// import { useAtom } from "jotai";
// import { useNavigate } from "react-router-dom";
// import { atomWithStorage } from "jotai/utils";
// import { useState, useEffect } from "react";
// import "./Tables.css";

// const tableAvailableAtom = atomWithStorage("tableAvailable", [
//   "Table 1",
//   "Table 2",
//   "Table 3",
//   "Table 4",
//   "Table 5",
//   "Table 6",
//   "Table 7",
//   "Table 8",
//   "Table 9",
// ]);
// const tableReservedAtom = atomWithStorage("tableReserved", []);

// const Tables = () => {
//   const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
//   const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
//   const [orders, setOrders] = useState([]);
//   const [selectedTable, setSelectedTable] = useState(null);
//   const navigate = useNavigate();

//   const onClickData = async (table) => {
//     try {
//       // Extract table number from table name
//       const tableNumber = table.split(" ")[1];

//       if (tableAvailable.includes(table)) {
//         // Update table availability and reservation state instantly
//         setTableReserved([...tableReserved, table]);
//         setTableAvailable(tableAvailable.filter((res) => res !== table));

//         // Set the selected table ID in localStorage
//         localStorage.setItem("selectedTableId", table);

//         // Navigate to /pos with the selected table ID
//         navigate(`/pos/${table}`);
//       } else {
//         // Fetch orders for the reserved table
//         const response = await fetch(
//           `http://localhost:5000/orders/table/${tableNumber}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch orders");
//         }
//         const ordersData = await response.json();
//         setOrders(ordersData);
//         setSelectedTable(table);
//         console.log("Orders for table", table, ordersData);
//       }
//     } catch (error) {
//       console.error("Error fetching orders:", error.message);
//     }
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       if (selectedTable) {
//         const tableNumber = selectedTable.split(" ")[1];
//         const response = await fetch(
//           `http://localhost:5000/orders/table/${tableNumber}`
//         );
//         if (!response.ok) {
//           throw new Error("Failed to fetch orders");
//         }
//         const ordersData = await response.json();
//         setOrders(ordersData);
//       }
//     };
//     fetchData();
//   }, [selectedTable]);

//   return (
//     <div className="justify-center items-center">
//       <div className="tables-container">
//         <h1 className="table-heading">Tables</h1>
//         <div className="flex flex-col">
//           <DrawGrid
//             tableAvailable={tableAvailable}
//             tableReserved={tableReserved}
//             onClickData={onClickData}
//           />
//           {selectedTable && orders.length > 0 && (
//             <OrderDetails table={selectedTable} orders={orders} />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const DrawGrid = ({ tableAvailable, tableReserved, onClickData }) => {
//   const allTables = [...tableAvailable, ...tableReserved].sort((a, b) => {
//     const aNum = parseInt(a.split(" ")[1]);
//     const bNum = parseInt(b.split(" ")[1]);
//     return aNum - bNum;
//   });

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 p-2">
//       {allTables.map((table) => (
//         <div
//           className={`table ${
//             tableAvailable.includes(table) ? "available" : "reserved"
//           }`}
//           key={table}
//           onClick={() => onClickData(table)}
//         >
//           {table}
//           <span className="status-text">
//             {tableAvailable.includes(table) ? "Available" : "Reserved"}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const OrderDetails = ({ table, orders }) => {
//   const [productNames, setProductNames] = useState({});

//   const fetchProductNames = async () => {
//     const productNamesMap = {};
//     try {
//       const response = await fetch(`http://localhost:5000/products`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch product names");
//       }
//       const productsData = await response.json();
//       productsData.forEach((product) => {
//         productNamesMap[product._id] = product.name;
//       });
//       setProductNames(productNamesMap);
//     } catch (error) {
//       console.error("Error fetching product names:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchProductNames();
//   }, []);

//   // Calculate total amount for all items
//   const totalAmount = orders.reduce((acc, order) => {
//     return acc + order.items.reduce((acc, item) => acc + item.totalAmount, 0);
//   }, 0);

//   return (
//     <div className="overflow-x-auto p-4 mt-4 text-xl font-semibold">
//       <h2 className="text-2xl font-bold mb-2 text-left text-red-500">
//         Orders for {table}
//       </h2>
//       <table className="divide-y divide-gray-200">
//         <thead className="border border-gray-200">
//           <tr>
//             <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//               Item
//             </th>
//             <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//               Quantity
//             </th>
//             <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
//               Total
//             </th>
//           </tr>
//         </thead>
//         <tbody className=" divide-y divide-gray-200">
//           {orders.map((order, index) => (
//             <tr key={index} className="border border-gray-200">
//               <td className="px-6 py-4 whitespace-nowrap text-left">
//                 {order.items.map((item, idx) => (
//                   <div key={idx}>
//                     <span className="font-medium text-green-500">
//                       {productNames[item.product] || "Unknown Product"}
//                     </span>
//                   </div>
//                 ))}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-left">
//                 {order.items.map((item, idx) => (
//                   <div key={idx}>{item.quantity}</div>
//                 ))}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-left">
//                 {order.items.map((item, idx) => (
//                   <div key={idx}>{item.totalAmount.toLocaleString()}</div>
//                 ))}
//               </td>
//             </tr>
//           ))}
//           <tr className="border border-gray-200 ">
//             <td className="px-6 py-4 text-center" colSpan="2"></td>
//             <td className="px-6 py-4 whitespace-nowrap text-left">
//               {" "}
//               <span className="text-2xl font-bold text-red">Total: </span>
//               {totalAmount.toLocaleString()}
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default Tables;

import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { atomWithStorage } from "jotai/utils";
import { useState, useEffect } from "react";
import "./Tables.css";

const tableAvailableAtom = atomWithStorage("tableAvailable", [
  "Table 1",
  "Table 2",
  "Table 3",
  "Table 4",
  "Table 5",
  "Table 6",
  "Table 7",
  "Table 8",
  "Table 9",
]);
const tableReservedAtom = atomWithStorage("tableReserved", []);

const Tables = () => {
  const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
  const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
  const [orders, setOrders] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  const onClickData = async (table) => {
    try {
      const tableNumber = table.split(" ")[1];

      if (tableAvailable.includes(table)) {
        setTableReserved([...tableReserved, table]);
        setTableAvailable(tableAvailable.filter((res) => res !== table));
        localStorage.setItem("selectedTableId", table);
        navigate(`/pos/${table}`);
      } else {
        const response = await fetch(
          `http://localhost:5000/orders/table/${tableNumber}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await response.json();
        setOrders(ordersData);
        setSelectedTable(table);
        console.log("Orders for table", table, ordersData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const closeOrder = async (tableNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/close/${tableNumber}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to close the order");
      }
      const result = await response.json();
      console.log(result.message);

      // Update UI accordingly
      setTableReserved(
        tableReserved.filter((table) => table !== `Table ${tableNumber}`)
      );
      setTableAvailable([...tableAvailable, `Table ${tableNumber}`]);
      setSelectedTable(null);
      setOrders([]);
    } catch (error) {
      console.error("Error closing the order:", error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedTable) {
        const tableNumber = selectedTable.split(" ")[1];
        const response = await fetch(
          `http://localhost:5000/orders/table/${tableNumber}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const ordersData = await response.json();
        setOrders(ordersData);
      }
    };
    fetchData();
  }, [selectedTable]);

  return (
    <div className="justify-center items-center">
      <div className="tables-container">
        <h1 className="table-heading">Tables</h1>
        <div className="flex flex-col">
          <DrawGrid
            tableAvailable={tableAvailable}
            tableReserved={tableReserved}
            onClickData={onClickData}
          />
          {selectedTable && orders.length > 0 && (
            <OrderDetails
              table={selectedTable}
              orders={orders}
              closeOrder={closeOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const DrawGrid = ({ tableAvailable, tableReserved, onClickData }) => {
  const allTables = [...tableAvailable, ...tableReserved].sort((a, b) => {
    const aNum = parseInt(a.split(" ")[1]);
    const bNum = parseInt(b.split(" ")[1]);
    return aNum - bNum;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 p-2">
      {allTables.map((table) => (
        <div
          className={`table ${
            tableAvailable.includes(table) ? "available" : "reserved"
          }`}
          key={table}
          onClick={() => onClickData(table)}
        >
          {table}
          <span className="status-text">
            {tableAvailable.includes(table) ? "Available" : "Reserved"}
          </span>
        </div>
      ))}
    </div>
  );
};

const OrderDetails = ({ table, orders, closeOrder }) => {
  const [productNames, setProductNames] = useState({});

  const fetchProductNames = async () => {
    const productNamesMap = {};
    try {
      const response = await fetch(`http://localhost:5000/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch product names");
      }
      const productsData = await response.json();
      productsData.forEach((product) => {
        productNamesMap[product._id] = product.name;
      });
      setProductNames(productNamesMap);
    } catch (error) {
      console.error("Error fetching product names:", error.message);
    }
  };

  useEffect(() => {
    fetchProductNames();
  }, []);

  const totalAmount = orders.reduce((acc, order) => {
    return acc + order.items.reduce((acc, item) => acc + item.totalAmount, 0);
  }, 0);

  return (
    <div className="overflow-x-auto p-4 mt-4 text-xl font-semibold">
      <h2 className="text-2xl font-bold mb-2 text-left text-red-500">
        Orders for {table}
      </h2>
      <table className="divide-y divide-gray-200">
        <thead className="border border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>
            <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200">
          {orders.map((order, index) => (
            <tr key={index} className="border border-gray-200">
              <td className="px-6 py-4 whitespace-nowrap text-left">
                {order.items.map((item, idx) => (
                  <div key={idx}>
                    <span className="font-medium text-green-500">
                      {productNames[item.product] || "Unknown Product"}
                    </span>
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                {order.items.map((item, idx) => (
                  <div key={idx}>{item.quantity}</div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-left">
                {order.items.map((item, idx) => (
                  <div key={idx}>{item.totalAmount.toLocaleString()}</div>
                ))}
              </td>
            </tr>
          ))}
          <tr className="border border-gray-200 ">
            <td className="px-6 py-4 text-center" colSpan="2"></td>
            <td className="px-6 py-4 whitespace-nowrap text-left">
              {" "}
              <span className="text-2xl font-bold text-red">Total: </span>
              {totalAmount.toLocaleString()}{" "}
              <span className="text-2xl">L.L</span>
            </td>
          </tr>
        </tbody>
      </table>
      <button
        className="mt-4 px-6 py-2 bg-red-500 text-white font-semibold rounded"
        onClick={() => closeOrder(table.split(" ")[1])}
      >
        Close Order
      </button>
    </div>
  );
};

export default Tables;
