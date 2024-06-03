import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./Tables.css";
import {
  Table,
  Order,
  ProductNameMap,
  DrawGridProps,
  OrderDetailsProps,
  ToastProps,
} from "../types/AllTypes";

const tableAvailableAtom = atomWithStorage<Table[]>("tableAvailable", [
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

const tableReservedAtom = atomWithStorage<Table[]>("tableReserved", []);

const fetchOrders = async (tableNumber: string): Promise<Order[]> => {
  try {
    const response = await fetch(
      `http://localhost:5000/orders/table/${tableNumber}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }
    const orders = await response.json();

    // Return only the most recent order for the table
    const latestOrder = orders.length > 0 ? [orders[orders.length - 1]] : [];
    console.log("Fetched orders for table", tableNumber, ":", latestOrder);
    return latestOrder;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return [];
  }
};

const closeOrder = async (tableNumber: string): Promise<void> => {
  const response = await fetch(
    `http://localhost:5000/orders/close/${tableNumber}`,
    {
      method: "POST",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to close the order");
  }
  await response.json();
};

const Tables = () => {
  const [tableAvailable, setTableAvailable] = useAtom(tableAvailableAtom);
  const [tableReserved, setTableReserved] = useAtom(tableReservedAtom);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["orders", selectedTable],
    queryFn: () => fetchOrders(selectedTable!.split(" ")[1]),
    enabled: !!selectedTable,
  });

  // Function to fetch the latest order for a table
  const fetchLatestOrder = async (tableNumber: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/orders/table/${tableNumber}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const orders = await response.json();
      // Return only the most recent order for the table
      const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null;
      setLatestOrder(latestOrder);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setLatestOrder(null);
    }
  };

  useEffect(() => {
    if (selectedTable) {
      fetchLatestOrder(selectedTable.split(" ")[1]);
    }
  }, [selectedTable]);

  // console.log("Selected Table:", selectedTable);
  // console.log("Orders:", orders);

  const reserveTableMutation = useMutation({
    mutationFn: (table: Table) => {
      return new Promise<void>((resolve) => {
        setTableReserved((prev) => [...prev, table]);
        setTableAvailable((prev) => prev.filter((res) => res !== table));
        localStorage.setItem("selectedTableId", table);
        navigate(`/pos/${table}`);
        resolve();
      });
    },
  });

  // console.log("Selected Table:", selectedTable);
  // console.log("Orders:", orders);

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

  // console.log("Selected Table:", selectedTable);
  // console.log("Orders:", orders);

  const onClickData = async (table: Table) => {
    if (tableAvailable.includes(table)) {
      reserveTableMutation.mutate(table);
    } else {
      setSelectedTable(table);
      // Fetch orders for the selected table here
      await fetchOrders(table.split(" ")[1]);
    }
  };

  // console.log("Selected Table:", selectedTable);
  // console.log("Orders:", orders);

  return (
    <div className="flex flex-col items-center">
      <div className="tables-container w-full max-w-4xl mx-auto">
        <h1 className="table-heading text-2xl font-bold mb-4">Tables</h1>
        <div className="flex flex-col space-y-4">
          <DrawGrid
            tableAvailable={tableAvailable}
            tableReserved={tableReserved}
            onClickData={onClickData}
          />
          {selectedTable && latestOrder && (
            <OrderDetails
              table={selectedTable}
              orders={[latestOrder]}
              closeOrder={() =>
                closeOrderMutation.mutate(selectedTable.split(" ")[1])
              }
            />
          )}
        </div>
      </div>
      {showToast && <Toast message="Order closed successfully" />}
    </div>
  );
};

const DrawGrid = ({
  tableAvailable,
  tableReserved,
  onClickData,
}: DrawGridProps) => {
  const allTables = [...tableAvailable, ...tableReserved].sort((a, b) => {
    const aNum = parseInt(a.split(" ")[1]);
    const bNum = parseInt(b.split(" ")[1]);
    return aNum - bNum;
  });

  return (
    <div className="table-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allTables.map((table) => (
        <div
          key={table}
          className={`table-item p-4 text-center rounded-lg shadow-md cursor-pointer ${
            tableAvailable.includes(table) ? "bg-green-500" : "bg-red-500"
          }`}
          onClick={() => onClickData(table)}
        >
          {table}
        </div>
      ))}
    </div>
  );
};

const OrderDetails = ({ table, orders, closeOrder }: OrderDetailsProps) => {
  const [productNames, setProductNames] = useState<ProductNameMap>({});

  const fetchProductNames = async () => {
    const productNamesMap: ProductNameMap = {};
    try {
      const response = await fetch(`http://localhost:5000/products`);
      if (!response.ok) {
        throw new Error("Failed to fetch product names");
      }
      const productsData = await response.json();
      productsData.forEach(
        (product: { _id: string | number; name: string }) => {
          productNamesMap[product._id] = product.name;
        }
      );
      setProductNames(productNamesMap);
    } catch (error) {
      console.error("Error fetching product names:", error.message);
    }
  };

  useEffect(() => {
    fetchProductNames();
  }, []);

  return (
    <div className="w-96 p-4 rounded-lg shadow-md bg-gray-900">
      <h2 className="text-xl font-bold mb-4">Orders for {table}</h2>
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index} className="mb-4">
            <div className="flex flex-col items-center justify-between mb-2">
              <p className="text-lg font-semibold">
                Status: <span className="text-green-500"> {order.status}</span>
              </p>
              <p className="text-lg font-semibold text-gray-200">
                Total Amount:{" "}
                <span className="text-green-500 font-semibold">
                  {order.totalAmount.toLocaleString()}
                </span>
              </p>
            </div>
            <p className="text-sm mb-2 text-gray-200">
              Created At: {new Date(order.createdAt).toLocaleString()}
            </p>
            <table className="w-full">
              <thead>
                <tr className="bg-red-500 text-lg font-semibold text-white">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="text-md font-medium text-white border-b border-gray-700"
                    >
                      <td className="p-2 text-left">
                        {productNames[item.product] || "Loading..."}
                      </td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">
                        {item.totalAmount.toLocaleString()} L.L
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-sm text-gray-500">
                    <td colSpan="3" className="p-2">
                      No items in this order
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No orders for this table</p>
      )}
      <button
        onClick={closeOrder}
        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Close Order
      </button>
    </div>
  );
};

const Toast = ({ message }: ToastProps) => (
  <div className="fixed top-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg">
    {message}
  </div>
);

export default Tables;
