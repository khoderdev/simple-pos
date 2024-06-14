// src/context/ApiContext.tsx

import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { parseISO, isValid } from "date-fns";
import { ApiContextType, Order, Item, Product } from "../types/AllTypes";
import { useAtom } from "jotai";
import { salesAtom } from "../States/store";
// Create the context
export const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Define a component that will provide the context to the entire app
export const ApiProvider: React.FC = ({ children }) => {
  const [orders, setOrders] = useAtom<Order[]>(salesAtom);
  //   const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Order[]>("http://localhost:5200/orders");
      const ordersWithProducts: Order[] = await Promise.all(
        response.data.map(async (order) => {
          // Handle cases where createdAt is missing or invalid
          if (!order.createdAt) {
            console.error(`Missing createdAt value for order ID: ${order._id}`);
            throw new Error(
              `Missing createdAt value for order ID: ${order._id}`
            );
          }

          // Parse and validate createdAt date
          const parsedCreatedAt = parseISO(order.createdAt);
          if (!isValid(parsedCreatedAt)) {
            console.error(`Invalid createdAt value for order ID: ${order._id}`);
            throw new Error(
              `Invalid createdAt value for order ID: ${order._id}`
            );
          }

          // Fetch items with products for each order
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
                // Handle or log the error as needed
                return { ...item, name: "Product Not Found", price: 0 }; // Example fallback
              }
            })
          );

          return {
            ...order,
            items: itemsWithProducts,
            createdAt: parsedCreatedAt,
          } as Order; // Ensure TypeScript knows this is of type Order
        })
      );

      // Update state with orders including parsed createdAt values
      setOrders(ordersWithProducts);
    } catch (error) {
      console.error("Error fetching orders:", error);
      // Handle loading state if needed
    } finally {
      setLoading(false);
    }
  };

  // Function to update the reservation status of a table in the backend
  const updateTableReservationStatus = async (
    tableId: string,
    isReserved: string
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

  // Update the closeOrder function to set isReserved to false when closing an order
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

      // Update the reservation status of the table in the backend
      await updateTableReservationStatus(tableNumber, false);

      await response.json();
    } catch (error: any) {
      console.error("Error closing order:", error.message);
      // Handle error if needed
    }
  };

  return (
    <ApiContext.Provider value={{ orders, loading, fetchOrders, closeOrder }}>
      {children}
    </ApiContext.Provider>
  );
};
