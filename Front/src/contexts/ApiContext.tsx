// // src/context/ApiContext.tsx

// import React, { createContext, useEffect, useState } from "react";
// import axios from "axios";
// import { parseISO, isValid } from "date-fns";
// import { ApiContextType, Order, Item, Product, Table } from "../types/AllTypes";
// import { useAtom } from "jotai";
// import {
//   salesAtom,
//   tableAvailableAtom,
//   tableReservedAtom,
// } from "../States/store";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const ApiContext = createContext<ApiContextType | undefined>(undefined);

// export const ApiProvider: React.FC = ({ children }) => {
//   const [orders, setOrders] = useAtom<Order[]>(salesAtom);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
//   const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
//   const [selectedTable, setSelectedTable] = useState<Table | null>(null);
//   const [showToast, setShowToast] = useState(false);
//   const queryClient = useQueryClient();
//   const [latestOrder, setLatestOrder] = useState<Order | null>(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async (tableNumber?: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.get<Order[]>("http://localhost:5200/orders");
//       const ordersWithProducts: Order[] = await Promise.all(
//         response.data.map(async (order) => {
//           if (!order.createdAt) {
//             console.error(`Missing createdAt value for order ID: ${order._id}`);
//             throw new Error(
//               `Missing createdAt value for order ID: ${order._id}`
//             );
//           }

//           const parsedCreatedAt = parseISO(order.createdAt);
//           if (!isValid(parsedCreatedAt)) {
//             console.error(`Invalid createdAt value for order ID: ${order._id}`);
//             throw new Error(
//               `Invalid createdAt value for order ID: ${order._id}`
//             );
//           }

//           const itemsWithProducts: Item[] = await Promise.all(
//             order.items.map(async (item) => {
//               try {
//                 const productResponse = await axios.get<Product>(
//                   `http://localhost:5200/products/${item.product}`
//                 );
//                 const product = productResponse.data;
//                 return { ...item, name: product.name, price: product.price };
//               } catch (error) {
//                 console.error(
//                   `Error fetching product for item ID: ${item._id}`,
//                   error
//                 );
//                 return { ...item, name: "Product Not Found", price: 0 };
//               }
//             })
//           );

//           return {
//             ...order,
//             items: itemsWithProducts,
//             createdAt: parsedCreatedAt,
//           } as Order;
//         })
//       );

//       setOrders(ordersWithProducts);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useQuery<Order[]>({
//     queryKey: ["orders", selectedTable],
//     queryFn: () => fetchOrders(selectedTable!.split(" ")[1]),
//     enabled: !!selectedTable,
//   });

//   const fetchLatestOrder = async (tableNumber: string) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5200/orders/table/${tableNumber}`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch orders");
//       }
//       const orders = await response.json();
//       const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
//       setLatestOrder(latestOrder);
//     } catch (error: any) {
//       console.error("Error fetching orders:", error.message);
//       setLatestOrder(null);
//     }
//   };

//   useEffect(() => {
//     if (selectedTable) {
//       fetchLatestOrder(selectedTable.split(" ")[1]);
//     }
//   }, [selectedTable]);

//   const reserveTable = async (table: Table) => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       setTableReserved((prev) => [...prev, table]);
//       setTableAvailable((prev) => prev.filter((res) => res !== table));

//       await updateTableReservationStatus(table, true);

//       localStorage.setItem("selectedTableId", table);

//       // Navigate to the POS page
//       // navigate(`/pos/${table}`);
//     } catch (error: any) {
//       console.error("Error reserving table:", error.message);
//     }
//   };

//   const updateTableReservationStatus = async (
//     tableId: string,
//     isReserved: boolean
//   ) => {
//     try {
//       const response = await fetch(`http://localhost:5200/tables/reserved`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ tableId, isReserved }),
//       });
//       if (!response.ok) {
//         throw new Error("Failed to update table reservation status");
//       }
//     } catch (error: any) {
//       throw new Error(
//         `Error updating table reservation status: ${error.message}`
//       );
//     }
//   };

//   const closeOrder = async (tableNumber: string): Promise<void> => {
//     try {
//       const response = await fetch(
//         `http://localhost:5200/orders/close/${tableNumber}`,
//         {
//           method: "POST",
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to close the order");
//       }

//       await updateTableReservationStatus(tableNumber, false);

//       await response.json();
//     } catch (error: any) {
//       console.error("Error closing order:", error.message);
//     }
//   };

//   const onClickData = async (table: Table) => {
//     if (tableAvailable.includes(table)) {
//       await reserveTable(table);
//     } else {
//       setSelectedTable(table);
//       await fetchOrders(table.split(" ")[1]);
//     }
//   };

//   const closeOrderMutation = useMutation({
//     mutationFn: (tableNumber: string) => closeOrder(tableNumber),
//     onSuccess: (_data, variables) => {
//       const tableNumber = variables;
//       setTableReserved((prev) =>
//         prev.filter((table) => table !== `Table ${tableNumber}`)
//       );
//       setTableAvailable((prev) => [...prev, `Table ${tableNumber}`]);
//       setSelectedTable(null);
//       queryClient.invalidateQueries({
//         queryKey: ["orders", `Table ${tableNumber}`],
//       });
//       setShowToast(true);
//       setTimeout(() => setShowToast(false), 3000);
//     },
//   });

//   return (
//     <ApiContext.Provider
//       value={{
//         orders,
//         loading,
//         fetchOrders,
//         closeOrder,
//         reserveTable,
//         fetchLatestOrder,
//         updateTableReservationStatus,
//         onClickData,
//         closeOrderMutation,
//       }}
//     >
//       {children}
//     </ApiContext.Provider>
//   );
// };

// src/context/ApiContext.tsx

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

import { parseISO, isValid } from "date-fns";
import { ApiContextType, Order, Item, Product, Table } from "../types/AllTypes";
import { useAtom } from "jotai";
import {
  salesAtom,
  tableAvailableAtom,
  tableReservedAtom,
} from "../States/store";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Create the context
export const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Define a component that will provide the context to the entire app
export const ApiProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useAtom<Order[]>(salesAtom);
  const [loading, setLoading] = useState<boolean>(false);
  const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
  const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (tableNumber?: string) => {
    setLoading(true);
    try {
      const response = await axios.get<Order[]>("http://localhost:5200/orders");
      const ordersWithProducts: Order[] = await Promise.all(
        response.data.map(async (order) => {
          if (!order.createdAt) {
            console.error(`Missing createdAt value for order ID: ${order._id}`);
            throw new Error(
              `Missing createdAt value for order ID: ${order._id}`
            );
          }

          const parsedCreatedAt = parseISO(order.createdAt);
          if (!isValid(parsedCreatedAt)) {
            console.error(`Invalid createdAt value for order ID: ${order._id}`);
            throw new Error(
              `Invalid createdAt value for order ID: ${order._id}`
            );
          }

          const itemsWithProducts: Item[] = await Promise.all(
            order.items.map(async (item) => {
              try {
                const productResponse = await axios.get<Product>(
                  `http://localhost:5200/products/${item.product}`
                );
                const product = productResponse.data;
                return { ...item, name: product.name, price: product.price };
              } catch (error) {
                console.error(
                  `Error fetching product for item ID: ${item._id}`,
                  error
                );
                return { ...item, name: "Product Not Found", price: 0 };
              }
            })
          );

          return {
            ...order,
            items: itemsWithProducts,
            createdAt: parsedCreatedAt,
          } as Order;
        })
      );

      setOrders(ordersWithProducts);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useQuery<Order[]>({
    queryKey: ["orders", selectedTable],
    queryFn: () => fetchOrders(selectedTable!.split(" ")[1]),
    enabled: !!selectedTable,
  });

  const fetchLatestOrder = async (tableNumber: string) => {
    try {
      const response = await fetch(
        `http://localhost:5200/orders/table/${tableNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();
      const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
      setLatestOrder(latestOrder);
    } catch (error: any) {
      console.error("Error fetching orders:", error.message);
      setLatestOrder(null);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchLatestOrder(selectedTable.split(" ")[1]);
    }
  }, [selectedTable]);

  const reserveTable = async (table: Table) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTableReserved((prev) => [...prev, table]);
      setTableAvailable((prev) => prev.filter((res) => res !== table));

      await updateTableReservationStatus(table, true);

      localStorage.setItem("selectedTableId", table);

      navigate(`/pos/${table}`);
    } catch (error: any) {
      console.error("Error reserving table:", error.message);
    }
  };

  const updateTableReservationStatus = async (
    tableId: string,
    isReserved: boolean
  ) => {
    try {
      const response = await fetch(`http://localhost:5200/tables/reserved`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableId, isReserved }),
      });
      if (!response.ok) {
        throw new Error("Failed to update table reservation status");
      }
    } catch (error: any) {
      throw new Error(
        `Error updating table reservation status: ${error.message}`
      );
    }
  };

  const closeOrder = async (tableNumber: string): Promise<void> => {
    try {
      const response = await fetch(
        `http://localhost:5200/orders/close/${tableNumber}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to close the order");
      }

      await updateTableReservationStatus(tableNumber, false);

      await response.json();
    } catch (error: any) {
      console.error("Error closing order:", error.message);
    }
  };

  const onClickData = async (table: Table) => {
    if (tableAvailable.includes(table)) {
      await reserveTable(table);
    } else {
      setSelectedTable(table);
      await fetchOrders(table.split(" ")[1]);
    }
  };

  const closeOrderMutation = useMutation({
    mutationFn: (tableNumber: string) => closeOrder(tableNumber),
    onSuccess: (_data, variables) => {
      const tableNumber = variables;
      setTableReserved((prev) =>
        prev.filter((table) => table !== `Table ${tableNumber}`)
      );
      setTableAvailable((prev) => [...prev, `Table ${tableNumber}`]);
      setSelectedTable(null);
      queryClient.invalidateQueries({
        queryKey: ["orders", `Table ${tableNumber}`],
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
  });

  return (
    <ApiContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        closeOrder,
        reserveTable,
        fetchLatestOrder,
        updateTableReservationStatus,
        onClickData,
        closeOrderMutation,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
