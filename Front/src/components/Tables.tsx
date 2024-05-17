// // import { useAtom } from "jotai";
// // import { useNavigate } from "react-router-dom";
// // import { atomWithStorage } from "jotai/utils";
// // import "./Tables.css";

// // const tableAvailableAtom = atomWithStorage("tableAvailable", [
// //   "Table 1",
// //   "Table 2",
// //   "Table 3",
// //   "Table 4",
// //   "Table 5",
// //   "Table 6",
// //   "Table 7",
// //   "Table 8",
// //   "Table 9",
// // ]);
// // const tableReservedAtom = atomWithStorage("tableReserved", []);

// // const Tables = () => {
// //   const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
// //   const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
// //   const navigate = useNavigate();

// //   const onClickData = (table) => {
// //     if (tableReserved.includes(table)) {
// //       setTableAvailable([...tableAvailable, table]);
// //       setTableReserved(tableReserved.filter((res) => res !== table));
// //     } else {
// //       setTableReserved([...tableReserved, table]);
// //       setTableAvailable(tableAvailable.filter((res) => res !== table));
// //     }

// //     // Set the selected table ID in localStorage
// //     localStorage.setItem("selectedTableId", table);

// //     // Navigate to POSPage
// //     navigate(`/pos/${table}`);
// //   };

// //   return (
// //     <div className="justify-center items-center">
// //       <div className="tables-container">
// //         <h1 className="table-heading">Tables</h1>
// //         <div className="flex flex-col">
// //           <DrawGrid
// //             tableAvailable={tableAvailable}
// //             tableReserved={tableReserved}
// //             onClickData={onClickData}
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const DrawGrid = ({ tableAvailable, tableReserved, onClickData }) => {
// //   const allTables = [...tableAvailable, ...tableReserved].sort((a, b) => {
// //     const aNum = parseInt(a.split(' ')[1]);
// //     const bNum = parseInt(b.split(' ')[1]);
// //     return aNum - bNum;
// //   });

// //   return (
// //     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 p-2">
// //       {allTables.map((table) => (
// //         <div
// //           className={`table ${tableAvailable.includes(table) ? 'available' : 'reserved'}`}
// //           key={table}
// //           onClick={() => onClickData(table)}
// //         >
// //           {table}
// //           <span className="status-text">
// //             {tableAvailable.includes(table) ? 'Available' : 'Reserved'}
// //           </span>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default Tables;

// import { useAtom } from "jotai";
// import { useNavigate } from "react-router-dom";
// import { atomWithStorage } from "jotai/utils";
// import { useState } from "react";
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
//       const tableNumber = table.split(' ')[1];

//       // Fetch orders for the selected table
//       const response = await fetch(`http://localhost:5000/orders/table/${tableNumber}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//       }
//       const ordersData = await response.json();
//       setOrders(ordersData);
//       setSelectedTable(table);
//       console.log('Orders for table', table, ordersData);

//       // Update table availability and reservation state
//       if (!tableReserved.includes(table)) {
//         setTableReserved([...tableReserved, table]);
//         setTableAvailable(tableAvailable.filter((res) => res !== table));
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error.message);
//     }
//   };

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
//     const aNum = parseInt(a.split(' ')[1]);
//     const bNum = parseInt(b.split(' ')[1]);
//     return aNum - bNum;
//   });

//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-6 p-2">
//       {allTables.map((table) => (
//         <div
//           className={`table ${tableAvailable.includes(table) ? 'available' : 'reserved'}`}
//           key={table}
//           onClick={() => onClickData(table)}
//         >
//           {table}
//           <span className="status-text">
//             {tableAvailable.includes(table) ? 'Available' : 'Reserved'}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// };

// const OrderDetails = ({ table, orders }) => {
//   return (
//     <div className="order-details">
//       <h2>Orders for {table}</h2>
//       {orders.map((order, index) => (
//         <div key={index} className="order">
//           <h3>Order ID: {order._id}</h3>
//           <p>Total Amount: {order.totalAmount}</p>
//           <ul>
//             {order.items.map((item, idx) => (
//               <li key={idx}>
//                 Product ID: {item.product}, Quantity: {item.quantity}, Total Amount: {item.totalAmount}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Tables;

import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
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
      // Extract table number from table name
      const tableNumber = table.split(" ")[1];

      if (tableAvailable.includes(table)) {
        // Update table availability and reservation state instantly
        setTableReserved([...tableReserved, table]);
        setTableAvailable(tableAvailable.filter((res) => res !== table));

        // Set the selected table ID in localStorage
        localStorage.setItem("selectedTableId", table);

        // Navigate to /pos with the selected table ID
        navigate(`/pos/${table}`);
      } else {
        // Fetch orders for the reserved table
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
            <OrderDetails table={selectedTable} orders={orders} />
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

const OrderDetails = ({ table, orders }) => {
  return (
    <div className="order-details">
      <h2>Orders for {table}</h2>
      {orders.map((order, index) => (
        <div key={index} className="order">
          <h3>Order ID: {order._id}</h3>
          <p>Total Amount: {order.totalAmount}</p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                Product ID: {item.product}, Quantity: {item.quantity}, Total
                Amount: {item.totalAmount}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Tables;
