import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import Modal from "../components/Modal";

const BASE_URL = "https://pos-backend-on9v.onrender.com";

function POSPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await axios.get(
      "https://pos-backend-on9v.onrender.com/products"
    );
    setProducts(await result.data);
    setIsLoading(false);
  };

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

  const removeProduct = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post(
        "https://pos-backend-on9v.onrender.com/orders/new",
        {
          items: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount,
        }
      );
      console.log("Order placed successfully:", response.data);
      console.log("Items:", response.data.items);
      setShowModal(true);
      setCart([]);
      // Remove the following line
      setTotalAmount(0);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const componentRef = useRef();

  const handleReactToPrint = useReactToPrint({
    content: () => componentRef.current,
  });

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

  const handleCloseModal = () => setShowModal(false);

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
          <div className="sticky top-2">
            <div className="bg-[#1a1a1a] text-white sm:p-2 rounded">
              <table className="w-full mb-10 text-">
                <thead>
                  <tr>
                    <th className="text-left sm:text-xl sm:px-4 py-2">
                      Name
                    </th>
                    <th className="text-left sm:text-xl sm:px-4 py-2">
                      Price
                    </th>
                    <th className="text-left sm:text-xl sm:px-4 py-2">Qty</th>
                    <th className="text-left sm:text-xl sm:px-4 py-2">
                      Total
                    </th>
                    <th className="hidden sm:flex text-left sm:text-xl sm:px-4 py-2">
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
                      <td className="px-4 py-2 font-semibold text-gray-300">
                        {cartProduct.name}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.price.toLocaleString()} L.L
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.quantity}
                      </td>
                      <td className="px-4 py-2 text-gray-300">
                        {cartProduct.totalAmount.toLocaleString()} L.L
                      </td>
                      <td className="px-4 py-2">
                        <button
                          className="hidden sm:flex text-red px-2 py-1 rounded hover:border-red-600"
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
      <Modal
        show={showModal}
        totalAmount={totalAmount}
        onHide={handleCloseModal}
        onPrint={handleReactToPrint}
      />
    </>
  );
}

export default POSPage;
