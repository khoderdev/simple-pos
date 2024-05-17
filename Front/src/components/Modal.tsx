// function OrderSummaryModal({ isOpen, onClose, orderDetails }) {
//   if (!isOpen || !orderDetails) return null;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>
//           &times;
//         </span>
//         <h2 className="text-center text-2xl font-bold text-green-500 mb-5">Order Summary</h2>
//         <ul>
//           {orderDetails.items.map((item) => (
//             <li key={item.productId}></li>
//           ))}
//         </ul>
//         <h1 className="font-bold text-center">
//           Total: {" "}
//           <span className="font-medium">
//             {orderDetails.totalAmount.toLocaleString()} L.L
//           </span>
//         </h1>
//       </div>
//     </div>
//   );
// }

// export default OrderSummaryModal;
function OrderSummaryModal({ isOpen, onClose, orderDetails }) {
  if (!isOpen || !orderDetails) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2 className="text-center text-2xl font-bold text-green-500 mb-5">Order Summary</h2>
        <ul>
          {orderDetails.items.map((item) => (
            <li key={item.productId}>
              {/* Render item details here */}
            </li>
          ))}
        </ul>
        <h1 className="font-bold text-center">
          Total: {" "}
          <span className="font-medium">
            {orderDetails.totalAmount.toLocaleString()} L.L
          </span>
        </h1>
      </div>
    </div>
  );
}
export default OrderSummaryModal;