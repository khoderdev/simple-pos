import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
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
import {
  SetProductsFunction,
  SetCartFunction,
  CartItem,
  Product,
  Order,
} from "../types/AllTypes";

export const BASE_URL = "http://localhost:5000";

function POSPage() {
  const { tableId } = useParams();
  const [products, setProducts] = useAtom<Product[]>(productsAtom);
  const [isLoading, setIsLoading] = useAtom<boolean>(isLoadingAtom);
  const [cart, setCart]: [CartItem[], SetCartFunction] =
    useAtom<CartItem[]>(cartAtom);
  const [totalAmount, setTotalAmount] = useAtom<number>(totalAmountAtom);
  const [orderSummary, setOrderSummary]: [
    Order | null,
    (newValue: Order | null) => void
  ] = useAtom<Order | null>(orderSummaryAtom);
  const [isModalOpen, setIsModalOpen] = useAtom<boolean>(isModalOpenAtom);
  const [, setModalMessage] = useState("");
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

  const addProductToCart = (product: Product, quantity: number = 1) => {
    const existingCartItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );
    if (existingCartItemIndex !== -1) {
      const updatedCart = [...cart];
      if (
        product.quantity <
        updatedCart[existingCartItemIndex].quantity + quantity
      ) {
        setModalMessage(
          "You have reached the maximum available quantity for this product."
        );
        setIsModalOpen(true);
        return;
      }
      updatedCart[existingCartItemIndex].quantity += quantity;
      updatedCart[existingCartItemIndex].totalAmount +=
        product.price * quantity;
      setCart(updatedCart);
    } else {
      const newCartItem = {
        ...product,
        quantity: quantity,
        totalAmount: product.price * quantity,
      };
      setCart([...cart, newCartItem]);
    }
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity < 0) return;

    const updatedCart = cart.map((item) =>
      item._id === productId
        ? { ...item, quantity, totalAmount: item.price * quantity }
        : item
    );
    setCart(updatedCart);
  };

  const incrementCartItemQuantity = (productId: string) => {
    const product = products.find((product) => product._id === productId);
    if (product) {
      addProductToCart(product, 1);
    }
  };

  const decrementCartItemQuantity = (productId: string) => {
    const updatedCart = cart
      .map((item) => {
        if (item._id === productId && item.quantity > 0) {
          return {
            ...item,
            quantity: item.quantity - 1,
            totalAmount: item.price * (item.quantity - 1),
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
  };

  const removeProduct = (productId: string) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    try {
      const zeroQuantityItems = cart.filter((item) => item.quantity === 0);
      if (zeroQuantityItems.length > 0) {
        throw new Error("One or more items in the cart are not available.");
      }

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

      if (orderDetails.items && orderDetails.items.length > 0) {
        const productId = orderDetails.items[0].product;
        await deductProductQuantities(cart, productId, setProducts, products);
      } else {
        console.error("Error: No items found in order details.");
      }
    } catch (error: unknown) {
      console.error("Error placing order:", error);
      if (error instanceof AxiosError) {
        alert("Axios Error: " + error.message);
      } else {
        alert("Failed to place order. Please try again later.");
      }
    }
  };

  const deductProductQuantities = async (
    cartItems: CartItem[],
    productId: string | undefined,
    setProducts: SetProductsFunction,
    products: Product[]
  ) => {
    try {
      const updatedProducts = products.map((product) => {
        const cartItem = cartItems.find((item) => item._id === product._id);
        if (cartItem) {
          return {
            ...product,
            quantity: product.quantity - cartItem.quantity,
          };
        }
        return product;
      });
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));

      if (productId) {
        await axios.put(`${BASE_URL}/products/${productId}`, { cartItems });
      } else {
        console.error("productId is undefined");
      }
    } catch (error: unknown) {
      console.error("Error deducting product quantities:", error);
      if (error instanceof AxiosError) {
        console.error("Axios Error:", error.message);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
    navigate("/tables");
  };

  const handleClickOutsideModal = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".modal")) {
      setIsModalOpen(false);
      navigate("/tables");
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
  }, [cart, setTotalAmount]);

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
          <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
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
          <div className="sticky top-24 ">
            <div className="bg-[#1a1a1a] text-white sm:p-2 rounded">
              <table className="w-full text-center">
                <thead className="w-full bg-red-500">
                  <tr>
                    <th className="text-left pl-6 sm:text-center sm:pl-0 sm:text-xl py-2">
                      Name
                    </th>
                    <th className="text-center sm:text-xl py-2">Price</th>
                    <th className="text-center sm:text-xl py-2">Qty</th>
                    <th className="text-center sm:text-xl py-2">Total</th>
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
                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.price.toLocaleString()} L.L
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        <div className="flex items-center justify-center">
                          <button
                            className="px-2 py-1 text-lg font-bold text-red rounded-md transition-colors duration-200 border-none"
                            onClick={() =>
                              decrementCartItemQuantity(cartProduct._id)
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={cartProduct.quantity}
                            onChange={(e) =>
                              updateCartItemQuantity(
                                cartProduct._id,
                                Number(e.target.value)
                              )
                            }
                            className="w-16  bg-gray-800 text-white text-center border border-gray-700 outline-none focus:border-red-500 rounded no-arrows"
                          />
                          <button
                            className="px-2 py-1 text-lg font-bold text-green-500 rounded-md transition-colors duration-200 border-none"
                            onClick={() =>
                              incrementCartItemQuantity(cartProduct._id)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.totalAmount.toLocaleString()} L.L
                      </td>
                      <td className="hidden sm:flex px-4 py-2">
                        <button
                          className="text-red px-2 py-1 rounded"
                          onClick={() => removeProduct(cartProduct._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex mt-10 justify-between items-center ">
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

//// POSPage.tsx
// import { useEffect, useState } from "react";
// import axios, { AxiosError } from "axios";
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
// import {
//   SetProductsFunction,
//   SetCartFunction,
//   CartItem,
//   Product,
//   Order,
// } from "../types/AllTypes";

// export const BASE_URL = "http://localhost:5000";

// function POSPage() {
//   const { tableId } = useParams();
//   const [products, setProducts] = useAtom<Product[]>(productsAtom);
//   const [isLoading, setIsLoading] = useAtom<boolean>(isLoadingAtom);
//   const [cart, setCart]: [CartItem[], SetCartFunction] =
//     useAtom<CartItem[]>(cartAtom);
//   const [totalAmount, setTotalAmount] = useAtom<number>(totalAmountAtom);
//   const [orderSummary, setOrderSummary]: [
//     Order | null,
//     (newValue: Order | null) => void
//   ] = useAtom<Order | null>(orderSummaryAtom);
//   const [isModalOpen, setIsModalOpen] = useAtom<boolean>(isModalOpenAtom);
//   const [, setModalMessage] = useState("");
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

//   const addProductToCart = (product: Product, quantity: number = 1) => {
//     const existingCartItemIndex = cart.findIndex(
//       (item) => item._id === product._id
//     );
//     if (existingCartItemIndex !== -1) {
//       const updatedCart = [...cart];
//       if (
//         product.quantity <
//         updatedCart[existingCartItemIndex].quantity + quantity
//       ) {
//         setModalMessage(
//           "You have reached the maximum available quantity for this product."
//         );
//         setIsModalOpen(true);
//         return;
//       }
//       updatedCart[existingCartItemIndex].quantity += quantity;
//       updatedCart[existingCartItemIndex].totalAmount +=
//         product.price * quantity;
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         ...product,
//         quantity: quantity,
//         totalAmount: product.price * quantity,
//       };
//       setCart([...cart, newCartItem]);
//     }
//   };

//   const updateCartItemQuantity = (productId: string, quantity: number) => {
//     if (quantity < 0) return;

//     const updatedCart = cart.map((item) =>
//       item._id === productId
//         ? { ...item, quantity, totalAmount: item.price * quantity }
//         : item
//     );
//     setCart(updatedCart);
//   };

//   const incrementCartItemQuantity = (productId: string) => {
//     const product = products.find((product) => product._id === productId);
//     if (product) {
//       addProductToCart(product, 1);
//     }
//   };

//   const decrementCartItemQuantity = (productId: string) => {
//     const updatedCart = cart
//       .map((item) => {
//         if (item._id === productId && item.quantity > 0) {
//           return {
//             ...item,
//             quantity: item.quantity - 1,
//             totalAmount: item.price * (item.quantity - 1),
//           };
//         }
//         return item;
//       })
//       .filter((item) => item.quantity > 0);
//     setCart(updatedCart);
//   };

//   const removeProduct = (productId: string) => {
//     const updatedCart = cart.filter((item) => item._id !== productId);
//     setCart(updatedCart);
//   };

//   // const placeOrder = async () => {
//   //   try {
//   //     const zeroQuantityItems = cart.filter((item) => item.quantity === 0);
//   //     if (zeroQuantityItems.length > 0) {
//   //       throw new Error("One or more items in the cart are not available.");
//   //     }

//   //     const response = await axios.post(`${BASE_URL}/orders/new`, {
//   //       items: cart.map((item) => ({
//   //         productId: item._id,
//   //         quantity: item.quantity,
//   //         price: item.price,
//   //         totalAmount: item.totalAmount,
//   //         product: item,
//   //       })),
//   //       totalAmount,
//   //       tableId,
//   //     });
//   //     const orderDetails = response.data;
//   //     console.log("Order placed successfully:", orderDetails);
//   //     setOrderSummary(orderDetails);
//   //     setIsModalOpen(true);
//   //     setCart([]);
//   //     setTotalAmount(0);

//   //     if (orderDetails.items && orderDetails.items.length > 0) {
//   //       const productId = orderDetails.items[0].product;
//   //       await deductProductQuantities(cart, productId, setProducts, products);
//   //     } else {
//   //       console.error("Error: No items found in order details.");
//   //     }
//   //   } catch (error: unknown) {
//   //     console.error("Error placing order:", error);
//   //     if (error instanceof AxiosError) {
//   //       alert("Axios Error: " + error.message);
//   //     } else {
//   //       alert("Failed to place order. Please try again later.");
//   //     }
//   //   }
//   // };

//   const placeOrder = async () => {
//     try {
//       const zeroQuantityItems = cart.filter((item) => item.quantity === 0);
//       if (zeroQuantityItems.length > 0) {
//         throw new Error("One or more items in the cart are not available.");
//       }

//       const response = await axios.post(`${BASE_URL}/orders/new`, {
//         items: cart.map((item) => ({
//           productId: item._id,
//           quantity: item.quantity,
//           price: item.price,
//           totalAmount: item.totalAmount,
//           product: item,
//         })),
//         totalAmount,
//         tableId,
//       });

//       const orderDetails = response.data;
//       console.log("Order placed successfully:", orderDetails);
//       setOrderSummary(orderDetails);
//       setIsModalOpen(true);
//       setCart([]);
//       setTotalAmount(0); // Resetting totalAmount after placing the order

//       // Assuming this logic deducts product quantities and updates product state
//       if (orderDetails.items && orderDetails.items.length > 0) {
//         const productId = orderDetails.items[0].product;
//         await deductProductQuantities(cart, productId, setProducts, products);
//       } else {
//         console.error("Error: No items found in order details.");
//       }

//       // Update the total sales by adding the current order's total amount
//       setTotalSales((prevTotalSales) => prevTotalSales + totalAmount);
//     } catch (error: unknown) {
//       console.error("Error placing order:", error);
//       if (error instanceof AxiosError) {
//         alert("Axios Error: " + error.message);
//       } else {
//         alert("Failed to place order. Please try again later.");
//       }
//     }
//   };

//   const deductProductQuantities = async (
//     cartItems: CartItem[],
//     productId: string | undefined,
//     setProducts: SetProductsFunction,
//     products: Product[]
//   ) => {
//     try {
//       const updatedProducts = products.map((product) => {
//         const cartItem = cartItems.find((item) => item._id === product._id);
//         if (cartItem) {
//           return {
//             ...product,
//             quantity: product.quantity - cartItem.quantity,
//           };
//         }
//         return product;
//       });
//       setProducts(updatedProducts);
//       localStorage.setItem("products", JSON.stringify(updatedProducts));

//       if (productId) {
//         await axios.put(`${BASE_URL}/products/${productId}`, { cartItems });
//       } else {
//         console.error("productId is undefined");
//       }
//     } catch (error: unknown) {
//       console.error("Error deducting product quantities:", error);
//       if (error instanceof AxiosError) {
//         alert("Axios Error: " + error.message);
//       } else {
//         alert("Failed to deduct product quantities. Please try again later.");
//       }
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     navigate("/");
//   };

//   const handleClickOutsideModal = (event: MouseEvent) => {
//     const modal = document.getElementById("modal");
//     if (modal && !modal.contains(event.target as Node)) {
//       handleCloseModal();
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     const newTotalAmount = cart.reduce(
//       (acc, item) => acc + item.totalAmount,
//       0
//     );
//     setTotalAmount(newTotalAmount);
//   }, [cart, setTotalAmount]);

//   useEffect(() => {
//     if (isModalOpen) {
//       document.addEventListener("click", handleClickOutsideModal);
//     } else {
//       document.removeEventListener("click", handleClickOutsideModal);
//     }

//     return () => {
//       document.removeEventListener("click", handleClickOutsideModal);
//     };
//   }, [isModalOpen]);

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

//         {/* Table */}
//         <div className="w-full lg:w-[50%] flex flex-col items-stretch mt-8 lg:mt-0">
//           <div className="sticky top-24 ">
//             <div className="bg-[#1a1a1a] text-white sm:p-2 rounded">
//               <table className="w-full text-center">
//                 <thead className="w-full bg-red-500">
//                   <tr>
//                     <th className="text-left pl-6 sm:text-center sm:pl-0 sm:text-xl py-2">
//                       Name
//                     </th>
//                     <th className="text-center sm:text-xl py-2">Price</th>
//                     <th className="text-center sm:text-xl py-2">Qty</th>
//                     <th className="text-center sm:text-xl py-2">Total</th>
//                     <th className="hidden sm:flex sm:text-center sm:text-xl pl-5 py-2">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cart.map((cartProduct) => (
//                     <tr
//                       key={cartProduct._id}
//                       className="border-t border-gray-500"
//                     >
//                       <td className="px-4 text-left py-2 font-semibold text-gray-300">
//                         {cartProduct.name}
//                       </td>
//                       <td className="px-4 py-2 text-gray-300">
//                         {cartProduct.price.toLocaleString()} L.L
//                       </td>
//                       <td className="px-4 py-2 text-gray-300">
//                         <div className="flex items-center justify-center">
//                           <button
//                             className="px-2 py-1 text-lg font-bold text-red rounded-md transition-colors duration-200 border-none"
//                             onClick={() =>
//                               decrementCartItemQuantity(cartProduct._id)
//                             }
//                           >
//                             -
//                           </button>
//                           <input
//                             type="number"
//                             min="0"
//                             value={cartProduct.quantity}
//                             onChange={(e) =>
//                               updateCartItemQuantity(
//                                 cartProduct._id,
//                                 Number(e.target.value)
//                               )
//                             }
//                             className="w-16  bg-gray-800 text-white text-center border border-gray-700 outline-none focus:border-red-500 rounded no-arrows"
//                           />
//                           <button
//                             className="px-2 py-1 text-lg font-bold text-green-500 rounded-md transition-colors duration-200 border-none"
//                             onClick={() =>
//                               incrementCartItemQuantity(cartProduct._id)
//                             }
//                           >
//                             +
//                           </button>
//                         </div>
//                       </td>
//                       <td className="px-4 py-2 text-gray-300">
//                         {cartProduct.totalAmount.toLocaleString()} L.L
//                       </td>
//                       <td className="hidden sm:flex px-4 py-2">
//                         <button
//                           className="text-red px-2 py-1 rounded"
//                           onClick={() => removeProduct(cartProduct._id)}
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex mt-10 justify-between items-center ">
//                 <p className="text-2xl sm:text-3xl text-red font-semibold">
//                   Total: {totalAmount.toLocaleString()} L.L
//                 </p>
//                 <div>
//                   {totalAmount !== 0 ? (
//                     <button
//                       className="bg-blue-500 px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-600 text-white"
//                       onClick={placeOrder}
//                     >
//                       Place Order
//                     </button>
//                   ) : (
//                     <p className="text-sm text-wrap">
//                       Please add a product to the cart
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <OrderSummaryModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         orderDetails={orderSummary}
//       />
//     </>
//   );
// }

// export default POSPage;
