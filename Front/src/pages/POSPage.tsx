import { useEffect } from "react";
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
import { useState } from "react";
import Modal from "../components/Modal";
import ModalDynamic from "../components/ModalDynamic";
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
  const [modalMessage, setModalMessage] = useState("");
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
  const addProductToCart = (product: Product) => {
    const existingCartItemIndex = cart.findIndex(
      (item) => item._id === product._id
    );
    if (existingCartItemIndex !== -1) {
      const updatedCart = [...cart];
      // Check if adding the quantity exceeds the available quantity for the product
      if (product.quantity < updatedCart[existingCartItemIndex].quantity + 1) {
        // Display a modal message indicating that the maximum available quantity has been reached
        setModalMessage(
          "You have reached the maximum available quantity for this product."
        );
        setIsModalOpen(true);
        return;
      }
      updatedCart[existingCartItemIndex].quantity++;
      updatedCart[existingCartItemIndex].totalAmount += product.price;
      setCart(updatedCart);
    } else {
      const newCartItem = {
        ...product,
        quantity: 1,
        totalAmount: Number(product.price),
      };
      setCart([...cart, newCartItem]);
    }
  };

  // Function to remove product from cart
  const removeProduct = (productId: string) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  // Function to place order
  const placeOrder = async () => {
    try {
      // Check if any item in the cart has a quantity of 0
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

      // Check if orderDetails.items is not empty before extracting productId
      if (orderDetails.items && orderDetails.items.length > 0) {
        const productId = orderDetails.items[0].product; // Assuming product ID is stored under 'product'

        // Deduct product quantities
        await deductProductQuantities(cart, productId, setProducts, products);
      } else {
        console.error("Error: No items found in order details.");
      }
    } catch (error: unknown) {
      console.error("Error placing order:", error);
      // Display user-friendly error message
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
        // Check if productId is defined before making the PUT request
        await axios.put(`${BASE_URL}/products/${productId}`, {
          cartItems,
        });
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

  // Function to close the modal message
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
