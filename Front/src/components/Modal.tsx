// import { OrderSummaryModalProps } from "../types/AllTypes";

// function OrderSummaryModal({ isOpen, onClose, orderDetails }: OrderSummaryModalProps) {
//   if (!isOpen || !orderDetails) return null;

//   const handleCloseModal = () => {
//     onClose();
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={handleCloseModal}>
//           &times;
//         </span>
//         <h2 className="text-center text-2xl font-bold text-green-500 mb-5">
//           Order Summary
//         </h2>
//         <ul>
//           {orderDetails.items.map((item, index) => (
//             <li key={index}>
//               {item.name}: {item.quantity} x {item.price} = {item.totalAmount}
//             </li>
//           ))}
//         </ul>
//         <h1 className="font-bold text-center">
//           Total:{" "}
//           <span className="font-medium">
//             {orderDetails.totalAmount.toLocaleString()} L.L
//           </span>
//         </h1>
//       </div>
//     </div>
//   );
// }

// export default OrderSummaryModal;

import React, { useEffect, useState } from "react";
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
  }, [initialIsOpen]);

  const handleCloseModal = () => {
    onClose();
  };

  if (!isOpen || !orderDetails) {
    return null; // Don't render anything if isOpen is false or orderDetails is null
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleCloseModal}>
          &times;
        </span>
        <h2 className="text-center text-2xl font-bold text-green-500 mb-5">
          Order Summary
        </h2>
        <ul>
          {itemDetails.map((item, index) => (
            <li key={index}>
              {/* Display item details */}
              {item.name}: {orderDetails?.items[index]?.quantity ?? ""} x{" "}
              {item.price} = {orderDetails?.items[index]?.totalAmount ?? ""}
            </li>
          ))}
        </ul>
        <h1 className="font-bold text-center">
          Total:{" "}
          <span className="font-medium">
            {orderDetails?.totalAmount?.toLocaleString() ?? ""} L.L
          </span>
        </h1>
      </div>
    </div>
  );
}

export default OrderSummaryModal;
