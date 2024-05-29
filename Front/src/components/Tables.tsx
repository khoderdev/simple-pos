import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./Tables.css";

type Table = string;

interface Order {
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  product: string;
  quantity: number;
  totalAmount: number;
}

interface ProductNameMap {
  [productId: string]: string;
}

interface DrawGridProps {
  tableAvailable: Table[];
  tableReserved: Table[];
  onClickData: (table: Table) => void;
}

interface OrderDetailsProps {
  table: Table;
  orders: Order[];
  closeOrder: () => void;
}

interface ToastProps {
  message: string;
}

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
  const response = await fetch(
    `http://localhost:5000/orders/table/${tableNumber}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  const data = await response.json();
  return data;
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

  const { data: orders, refetch } = useQuery<Order[]>({
    queryKey: ["orders", selectedTable],
    queryFn: () => fetchOrders(selectedTable!.split(" ")[1]),
    enabled: !!selectedTable,
  });

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

  const closeOrderMutation = useMutation({
    mutationFn: (tableNumber: string) => closeOrder(tableNumber),
    onSuccess: (data, variables) => {
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
  

  const onClickData = async (table: Table) => {
    if (tableAvailable.includes(table)) {
      reserveTableMutation.mutate(table);
    } else {
      setSelectedTable(table);
      refetch();
    }
  };
  

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
          {selectedTable && orders && (
            <OrderDetails
              table={selectedTable}
              orders={orders}
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

  return (
    <div className="md:w-[60%] lg:w-[50%] xl:w-[40%] p-4 rounded-lg shadow-md bg-black">
      <h2 className="text-xl font-bold mb-4">Orders for {table}</h2>
      <ul className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <li key={index} className="p-4 bg-gray-500 rounded-lg shadow-sm">
              <p className="text-lg font-semibold">Status: {order.status}</p>
              <p className="text-md text-gray-200">
                Total Amount:{" "}
                <span className="text-green-500 font-semibold">
                  {order.totalAmount.toLocaleString()}
                </span>
              </p>
              <p className="text-sm text-gray-200">
                Created At: {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul className="mt-2 space-y-2">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between p-2 bg-red-500 rounded-md shadow-sm"
                    >
                      <span className="text-md font-semibold text-black">
                        {productNames[item.product] || "Loading..."}
                      </span>
                      <span className="text-md text-center font-semibold text-black">
                        {item.quantity}
                      </span>
                      <span className="text-md font-semibold text-black">
                        {item.totalAmount.toLocaleString()} L.L
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500">
                    No items in this order
                  </li>
                )}
              </ul>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No orders for this table</li>
        )}
      </ul>
      <button
        onClick={closeOrder}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        Close Order
      </button>
    </div>
  );
};

const Toast = ({ message }: ToastProps) => (
  <div className="fixed bottom-4 right-4 px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg">
    {message}
  </div>
);

export default Tables;
