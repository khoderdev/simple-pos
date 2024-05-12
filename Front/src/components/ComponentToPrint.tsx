import React from "react";

export const ComponentToPrint = React.forwardRef((props, ref) => {
  const { cart, totalAmount } = props;
  return (
    <div ref={ref} className="p-5">
      <table className="table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Price</td>
            <td>Qty</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {cart.map((cartProduct, key) => (
            <tr key={key}>
              <td>{cartProduct.product.name}</td>
              <td>{cartProduct.product.price}</td>
              <td>{cartProduct.quantity}</td>
              <td>{cartProduct.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="px-2">Total Amount: {totalAmount} L.L</h2>
    </div>
  );
});


// import React from "react";

// export const ComponentToPrint = React.forwardRef((props, ref) => {
//   const { cart, totalAmount } = props;
//   return (
//     <div ref={ref} className="p-5">
//       <table className="table">
//         <thead>
//           <tr>
//             <td>Name</td>
//             <td>Price</td>
//             <td>Qty</td>
//             <td>Total</td>
//           </tr>
//         </thead>
//         <tbody>
//           {cart ? (
//             cart.map((cartProduct, key) => (
//               <tr key={key}>
//                 <td>{cartProduct.product.name}</td>
//                 <td>{cartProduct.product.price}</td>
//                 <td>{cartProduct.quantity}</td>
//                 <td>{cartProduct.totalAmount}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4">No items in the cart</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//       <h2 className="px-2">Total Amount: {totalAmount} L.L</h2>
//     </div>
//   );
// });
