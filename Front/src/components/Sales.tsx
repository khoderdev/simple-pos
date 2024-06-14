import { useContext } from "react";
import { useAtom } from "jotai";
import { format } from "date-fns";
import {
  isModalOpenAtom,
  orderSummaryAtom,
  startDateAtom,
  endDateAtom,
  selectedOrderAtom,
  orderStatusAtom,
} from "../States/store";
import { Order } from "../types/AllTypes";
import { ApiContext } from "../contexts/ApiContext";

const Sales = () => {
  const { orders, loading, closeOrder } = useContext(ApiContext);
  const [report, setReport] = useAtom(orderSummaryAtom);
  const [isModalOpen, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const [selectedOrder, setSelectedOrder] = useAtom(selectedOrderAtom);
  const [, setOrderStatus] = useAtom(orderStatusAtom);

  const generateReport = () => {
    if (!startDate || !endDate) {
      alert("Please select a valid date range.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert("Please select a valid date range.");
      return;
    }

    end.setHours(23, 59, 59, 999);

    const filteredOrders = orders.filter(
      (order: { createdAt: string | number | Date }) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= start && orderDate <= end;
      }
    );

    const totalSales = filteredOrders.reduce(
      (total: unknown, order: { totalAmount: unknown }) =>
        total + order.totalAmount,
      0
    );
    const totalOrders = filteredOrders.length;

    const newReport = (
      <div className="report p-4 text-white rounded-md">
        <h1 className="text-2xl !text-center font-bold mb-4">
          End of the day <br /> Report from ({start.toLocaleDateString()} to{" "}
          {end.toLocaleDateString()})
        </h1>
        <h3 className="mt-10 mb-2 text-red font-semibold text-xl">
          Total Sales:{" "}
          <span className="text-green-500 ml-2">
            {totalSales.toLocaleString()} L.L
          </span>
        </h3>
        <h3 className="mb-2 mr-4 text-red font-semibold text-xl">
          Total Orders:
          <span className="text-green-500 ml-2">{totalOrders}</span>
        </h3>
      </div>
    );

    setReport(newReport);
    setIsModalOpen(true);
  };

  const handleRowClick = (order: Order) => {
    setSelectedOrder((prevOrder: Order | null) =>
      prevOrder && prevOrder._id === order._id ? null : order
    );
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseOrder = async (tableNumber: string) => {
    try {
      const closedOrderId = await closeOrder(tableNumber);
      setOrderStatus((prevStatus) => ({
        ...prevStatus,
        [closedOrderId]: "Paid",
      }));
    } catch (error) {
      console.error("Error closing order:", error);
    }
  };

  return (
    <div className="sales-container flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-center">Sales Dashboard</h1>
      <div className="mb-4 flex space-x-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
          placeholder="End Date"
        />
        <button
          onClick={generateReport}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Generate Report
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full font-medium lg:w-2/3 border border-gray-900 p-6 bg-dark-blue rounded-md">
          {orders.length === 0 ? (
            <p className="text-red text-xl text-center">No Orders found</p>
          ) : (
            <>
              <div className="grid grid-cols-4 text-blue-500 border-b border-gray-700 pb-3 mb-3">
                <div className="text-lg font-bold">Order #</div>
                <div className="text-lg font-bold">Total</div>
                <div className="text-lg font-bold">Date</div>
                <div className="text-lg font-bold">Status</div>
              </div>
              {orders.map((order: Order, index: number) => (
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
                        {order.createdAt
                          ? format(order.createdAt, "yyyy-MM-dd HH:mm:ss")
                          : "Invalid Date"}
                      </div>
                      {order.table ? (
                        <div
                          className={`text-lg ${
                            order.table.status === "open"
                              ? "text-green-500"
                              : "text-red-500"
                          } text-left`}
                        >
                          {order.table.status || "Undefined"}
                        </div>
                      ) : (
                        <div className="text-lg text-gray-500 text-left">
                          Undefined
                        </div>
                      )}
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
                        {selectedOrder.createdAt
                          ? format(
                              selectedOrder.createdAt,
                              "yyyy-MM-dd HH:mm:ss"
                            )
                          : "Invalid Date"}
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
                      {order.table && order.table.status === "open" && (
                        <button
                          onClick={() =>
                            handleCloseOrder(order.tableId.split(" ")[1])
                          }
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-4"
                        >
                          Close Order
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#070f1b] p-6 rounded-lg shadow-lg w-full max-w-xl min-h-72 mx-4 relative">
            <div
              className="absolute top-2 right-2 text-white cursor-pointer hover:text-gray-700"
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
};

export default Sales;
