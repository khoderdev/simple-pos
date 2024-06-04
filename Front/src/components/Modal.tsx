import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { OrderSummaryModalProps, Product } from "../types/AllTypes";
import { BASE_URL } from "../pages/POSPage";

function OrderSummaryModal({
  isOpen: initialIsOpen,
  onClose,
  orderDetails,
}: OrderSummaryModalProps) {
  const [isOpen, setIsOpen] = useState<boolean>(initialIsOpen);
  const [itemDetails, setItemDetails] = useState<Product[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("0000");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialIsOpen && orderDetails?.items) {
      setIsOpen(true);
      // Fetch product details for each item
      const fetchItemDetails = async () => {
        try {
          const itemDetailsPromises = orderDetails.items.map((item) =>
            axios.get<Product>(`${BASE_URL}/products/${item.product}`)
          );
          const itemDetailsResponses = await Promise.all(itemDetailsPromises);
          const itemDetailsData = itemDetailsResponses.map(
            (response) => response.data
          );
          setItemDetails(itemDetailsData);
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      };

      fetchItemDetails();
    }
  }, [initialIsOpen, orderDetails]);

  useEffect(() => {
    // Update isOpen state when initialIsOpen changes
    setIsOpen(initialIsOpen);

    // Retrieve the current invoice number from local storage
    const storedInvoiceNumber = localStorage.getItem("invoiceNumber");
    if (storedInvoiceNumber) {
      setInvoiceNumber(storedInvoiceNumber);
    } else {
      setInvoiceNumber("0000");
    }
  }, [initialIsOpen]);

  const handleCloseModal = () => {
    onClose();
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  useEffect(() => {
    // Increment the invoice number and store it in local storage
    setInvoiceNumber((prevInvoiceNumber) => {
      const nextInvoiceNumber = (parseInt(prevInvoiceNumber) + 1)
        .toString()
        .padStart(4, "0");
      localStorage.setItem("invoiceNumber", nextInvoiceNumber);
      return nextInvoiceNumber;
    });
  }, [isOpen]);

  if (!isOpen || !orderDetails) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-gray-900 p-5 rounded-md shadow-md w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-red-500 absolute top-2 right-2"
          onClick={handleCloseModal}
        >
          &times;
        </button>
        <div ref={printRef}>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center">
              <img src="/logo.png" alt="Site Logo" className="h-10 mr-4" />
            </div>
            <span className="text-lg font-semibold">
              Invoice #{invoiceNumber}
            </span>
          </div>
          <div className="border-b border-gray-400 mb-5"></div>
          <div className="flex justify-between mb-3">
            <div className="flex items-center">
              <span className="font-semibold text-center">Date:</span>
              <span className="ml-2">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-center">Time:</span>
              <span className="ml-2">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="border-b border-gray-400 mb-5"></div>
          {/* Item headers */}
          <div className="flex justify-between mb-2 text-gray-300">
            <span className="font-bold text-center">Item</span>
            <span className="font-bold text-center">Qty</span>
            <span className="font-bold text-center">Price</span>
          </div>
          {itemDetails.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span className="text-center">{item.name}</span>
              <span className="text-center">
                {orderDetails.items[index]?.quantity ?? ""}
              </span>
              <span className="text-center">
                {item.price.toLocaleString()} L.L
              </span>
            </div>
          ))}

          <div className="border-b border-gray-400 mb-5"></div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-2xl text-center">Total:</span>
            <span className="font-semibold text-2xl text-center">
              {orderDetails.totalAmount?.toLocaleString()} L.L
            </span>
          </div>
        </div>

        <div className="flex justify-center mt-5">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            onClick={handlePrint}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryModal;
