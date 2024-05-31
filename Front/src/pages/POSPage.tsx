/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import {
  productsAtom,
  isLoadingAtom,
  cartAtom,
  totalAmountAtom,
  orderSummaryAtom,
  isModalOpenAtom,
} from "../States/store";
import OrderSummaryModal from "../components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { CartItem, Product, Item, Order } from "../AllTypes";

export const BASE_URL = "http://localhost:5000";

function POSPage() {
  const { tableId } = useParams();
  const [products, setProducts] = useAtom<Product[]>(productsAtom);
  const [isLoading, setIsLoading] = useAtom<boolean>(isLoadingAtom);
  const [cart, setCart] = useAtom<CartItem[]>(cartAtom);
  const [totalAmount, setTotalAmount] = useAtom<number>(totalAmountAtom);
  const [orderSummary, setOrderSummary] = useAtom<Order | null>(
    orderSummaryAtom
  );
  const [isModalOpen, setIsModalOpen] = useAtom<boolean>(isModalOpenAtom);

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const cachedProducts = localStorage.getItem("products");
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
      } else {
        const response = await axios.get(`${BASE_URL}/products`);
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
        localStorage.setItem("products", JSON.stringify(fetchedProducts));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add product to cart
  const addProductToCart = (product) => {
    const existingCartItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );
    if (existingCartItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingCartItemIndex].quantity++;
      updatedCart[existingCartItemIndex].totalAmount += product.price;
      setCart(updatedCart);
    } else {
      const newCartItem = {
        ...product,
        quantity: 1,
        totalAmount: product.price,
      };
      setCart((prevCart) => [...prevCart, newCartItem]);
    }
  };

  // Function to remove product from cart
  const removeProduct = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  // Function to place order
  const placeOrder = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/orders/new`, {
        items: cart.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
          totalAmount: item.totalAmount,
          product: item,
        })),
        totalAmount,
        tableId,
      });
      const orderDetails = response.data;
      console.log("Order placed successfully:", orderDetails);
      setOrderSummary(orderDetails);
      setIsModalOpen(true);
      setCart([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/tables"); // Navigate here instead
  };

  const handleClickOutsideModal = (event) => {
    if (event.target.className === "modal") {
      setIsModalOpen(false);
      navigate("/tables"); // Navigate here instead
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let newTotalAmount = 0;
    cart.forEach((item) => {
      newTotalAmount += item.totalAmount;
    });
    setTotalAmount(newTotalAmount);
  }, [cart]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("click", handleClickOutsideModal);
    } else {
      document.removeEventListener("click", handleClickOutsideModal);
    }

    return () => {
      document.removeEventListener("click", handleClickOutsideModal);
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap w-full h-full gap-2 justify-between p-2">
        <div className="w-full lg:w-fit">
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  gap-5">
            {isLoading ? (
              <div className="w-full sm:w-auto lg:w-[calc(33.33% - 1rem)] xl:w-[calc(25% - 1rem)] h-auto flex items-center justify-center bg-gray-800 rounded p-2 sm:p-4">
                Loading...
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-auto lg:w-[calc(33.33% - 1rem)] xl:w-[calc(25% - 1rem)] h-auto flex flex-col justify-between items-center bg-gray-800 rounded p-2 sm:p-4 cursor-pointer bg-red-hover"
                  onClick={() => addProductToCart(product)}
                >
                  <h4 className="text-[1.7rem] font-bold">{product.name}</h4>
                  <img
                    src={`${BASE_URL}/${product.image}`}
                    alt={product.name}
                    className="w-36"
                  />
                  <p className="mt-2 font-bold">
                    {product.price.toLocaleString()} L.L
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Table */}
        <div className="w-full lg:w-[50%] flex flex-col items-stretch mt-8 lg:mt-0">
          <div className="sticky top-24">
            <div className="bg-[#1a1a1a] text-white  sm:p-2 rounded">
              <table className="w-full mb-10 text-center">
                <thead className="w-full bg-red-500">
                  <tr>
                    <th className="text-left pl-6 sm:text-center sm:pl-0 sm:text-xl  py-2">
                      Name
                    </th>
                    <th className="text-center sm:text-xl  py-2">Price</th>
                    <th className="text-center sm:text-xl  py-2">Qty</th>
                    <th className="text-center sm:text-xl  py-2">Total</th>
                    <th className="hidden sm:flex sm:text-center sm:text-xl pl-5 py-2">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((cartProduct) => (
                    <tr
                      key={cartProduct._id}
                      className="border-t border-gray-500"
                    >
                      <td className="px-4 text-left py-2 font-semibold text-gray-300">
                        {cartProduct.name}
                      </td>
                      <td
                        className="px-4 py-2 text-gray-300
"
                      >
                        {cartProduct.price.toLocaleString()} L.L
                      </td>

                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.quantity}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.totalAmount.toLocaleString()} L.L
                      </td>
                      <td className="hidden sm:flex px-4 py-2">
                        <button
                          className="text-red px-2 py-1 rounded hover:border-red-600"
                          onClick={() => removeProduct(cartProduct._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center">
                <p className="text-2xl sm:text-3xl text-red font-semibold">
                  Total: {totalAmount.toLocaleString()} L.L
                </p>
                <div>
                  {totalAmount !== 0 ? (
                    <button
                      className="bg-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600 text-white"
                      onClick={placeOrder}
                    >
                      Place Order
                    </button>
                  ) : (
                    <p className="text-sm text-wrap">
                      Please add a product to the cart
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrderSummaryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        orderDetails={orderSummary}
      />
    </>
  );
}

export default POSPage;

// // POSPage.tsx
// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAtom } from "jotai";
// import {
//   productsAtom,
//   isLoadingAtom,
//   cartAtom,
//   totalAmountAtom,
//   orderSummaryAtom,
//   isModalOpenAtom,
// } from "../States/store";
// import OrderSummaryModal from "../components/Modal";
// import { useNavigate, useParams } from "react-router-dom";
// import { CartItem, Product, Item, Order } from "../AllTypes";
// import ReportDialog from "../components/reportDialog/reportDialog";
// import { AppTranslationHelper, AppViews } from "../common/types";
// import { WeekStartDays } from "../common/enums";


// export const BASE_URL = "http://localhost:5000";

// function POSPage() {
//   const { tableId } = useParams();
//   const [products, setProducts] = useAtom<Product[]>(productsAtom);
//   const [isLoading, setIsLoading] = useAtom<boolean>(isLoadingAtom);
//   const [cart, setCart] = useAtom<CartItem[]>(cartAtom);
//   const [totalAmount, setTotalAmount] = useAtom<number>(totalAmountAtom);
//   const [orderSummary, setOrderSummary] = useAtom<Order | null>(orderSummaryAtom);
//   const [isModalOpen, setIsModalOpen] = useAtom<boolean>(isModalOpenAtom);
//   const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

//   const navigate = useNavigate();

//   const fetchProducts = async () => {
//     setIsLoading(true);
//     try {
//       const cachedProducts = localStorage.getItem("products");
//       if (cachedProducts) {
//         setProducts(JSON.parse(cachedProducts));
//       } else {
//         const response = await axios.get(`${BASE_URL}/products`);
//         const fetchedProducts = response.data;
//         setProducts(fetchedProducts);
//         localStorage.setItem("products", JSON.stringify(fetchedProducts));
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addProductToCart = (product: Product) => {
//     const existingCartItemIndex = cart.findIndex((item) => item._id === product._id);
//     if (existingCartItemIndex !== -1) {
//       const updatedCart = [...cart];
//       updatedCart[existingCartItemIndex].quantity++;
//       updatedCart[existingCartItemIndex].totalAmount += product.price;
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         ...product,
//         quantity: 1,
//         totalAmount: product.price,
//       };
//       setCart((prevCart) => [...prevCart, newCartItem]);
//     }
//   };

//   const removeProduct = (productId: string) => {
//     const updatedCart = cart.filter((item) => item._id !== productId);
//     setCart(updatedCart);
//   };

//   const placeOrder = async () => {
//     try {
//       const response = await axios.post(`${BASE_URL}/orders/new`, {
//         items: cart.map((item) => ({
//           productId: item._id,
//           quantity: item.quantity,
//           totalAmount: item.totalAmount,
//         })),
//         tableId,
//         totalAmount,
//       });

//       const newOrder = response.data;
//       setOrderSummary(newOrder);
//       setIsModalOpen(true);
//       localStorage.removeItem("cart");
//       setCart([]);
//       navigate("/order-summary");
//     } catch (error) {
//       console.error("Error placing order:", error);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   useEffect(() => {
//     const savedCart = localStorage.getItem("cart");
//     if (savedCart) {
//       setCart(JSON.parse(savedCart));
//     }
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const total = cart.reduce((acc, item) => acc + item.totalAmount, 0);
//     setTotalAmount(total);
//   }, [cart]);

//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const handlePrintReport = (report) => {
//     console.log(report);
//     // Implement logic to handle report printing/displaying
//   };

//   return (
//     <>
//       <div className="flex flex-wrap lg:flex-nowrap w-full h-full gap-2 justify-between p-2">
//         <div className="w-full lg:w-fit">
//           <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
//             {isLoading ? (
//               <div className="w-full sm:w-auto lg:w-[calc(33.33% - 1rem)] xl:w-[calc(25% - 1rem)] h-auto flex items-center justify-center bg-gray-800 rounded p-2 sm:p-4">
//                 Loading...
//               </div>
//             ) : (
//               products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="w-full sm:w-auto lg:w-[calc(33.33% - 1rem)] xl:w-[calc(25% - 1rem)] h-auto flex flex-col justify-between items-center bg-gray-800 rounded p-2 sm:p-4 cursor-pointer bg-red-hover"
//                   onClick={() => addProductToCart(product)}
//                 >
//                   <h4 className="text-[1.7rem] font-bold">{product.name}</h4>
//                   <img
//                     src={`${BASE_URL}/${product.image}`}
//                     alt={product.name}
//                     className="w-36"
//                   />
//                   <p className="mt-2 font-bold">
//                     {product.price.toLocaleString()} L.L
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         <div className="w-full lg:w-fit">
//           <div className="bg-gray-800 rounded-lg p-4">
//             <h2 className="text-xl font-bold mb-4">Cart</h2>
//             {cart.map((item) => (
//               <div
//                 key={item._id}
//                 className="flex items-center justify-between mb-2"
//               >
//                 <div>
//                   <h4 className="font-bold">{item.name}</h4>
//                   <p>
//                     {item.quantity} x {item.price.toLocaleString()} L.L
//                   </p>
//                 </div>
//                 <button
//                   className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white"
//                   onClick={() => removeProduct(item._id)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//             <div className="border-t border-gray-600 mt-4 pt-4">
//               <h3 className="text-lg font-bold">
//                 Total: {totalAmount.toLocaleString()} L.L
//               </h3>
//               <button
//                 className="bg-blue-500 px-4 py-2 mt-4 rounded hover:bg-blue-600 text-white"
//                 onClick={placeOrder}
//               >
//                 Place Order
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <button
//         className="bg-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600 text-white"
//         onClick={() => setIsReportDialogOpen(true)}
//       >
//         Open Report Dialog
//       </button>

//       <OrderSummaryModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         orderDetails={orderSummary}
//       />

//       {isReportDialogOpen && (
//         <ReportDialog
//           onClose={() => setIsReportDialogOpen(false)}
//           onPrint={handlePrintReport}
//           translation={{
//             formatFinancial: (value) => value.toLocaleString(),
//             locale: 'en-US',
//             t: (key) => key, // Implement your translation logic
//           }}
//           views={{
//             closedOrders: {
//               getItemsByDateRange: ({ start, end }) => {
//                 // Implement logic to fetch or calculate the report data
//                 return {
//                   summary: { amount: 12345 },
//                   items: {
//                     'Item 1': { quantity: 10, amount: 5000 },
//                     'Item 2': { quantity: 5, amount: 2500 },
//                     // More items
//                   },
//                 };
//               },
//             },
//           }}
//           weekStartDay={WeekStartDays.Monday}
//         />
//       )}
//     </>
//   );
// }

// export default POSPage;