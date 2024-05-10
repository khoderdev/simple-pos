// import React, { useEffect, useRef, useState } from 'react';
// import MainLayout from '../layouts/MainLayout';
// import axios from "axios";
// import { toast } from 'react-toastify';
// import { ComponentToPrint } from '../components/ComponentToPrint';
// import { useReactToPrint } from 'react-to-print';

// function POSPage() {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [showPrintPreview, setShowPrintPreview] = useState(false);

//   const toastOptions = {
//     autoClose: 400,
//     pauseOnHover: true,
//   };

//   const fetchProducts = async () => {
//     setIsLoading(true);
//     const result = await axios.get('http://localhost:5000/products'); // Ensure correct endpoint URL
//     setProducts(await result.data);
//     setIsLoading(false);
//   };

//   const addProductToCart = (product) => {
//     const existingCartItemIndex = cart.findIndex(item => item._id === product._id);
//     if (existingCartItemIndex !== -1) {
//       const updatedCart = [...cart];
//       updatedCart[existingCartItemIndex].quantity++;
//       updatedCart[existingCartItemIndex].totalAmount += product.price;
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         ...product,
//         quantity: 1,
//         totalAmount: product.price
//       };
//       setCart(prevCart => [...prevCart, newCartItem]);
//     }
//     toast(`Added ${product.name} to cart`, toastOptions);
//   };

//   const removeProduct = (productId) => {
//     const updatedCart = cart.filter(item => item._id !== productId);
//     setCart(updatedCart);
//   };

//   const placeOrder = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/orders/new', {
//         items: cart.map(item => ({
//           productId: item._id,
//           quantity: item.quantity,
//           price: item.price
//         })),
//         totalAmount
//       });
//       console.log('Order placed successfully:', response.data);
//       setCart([]);
//       setTotalAmount(0);
//       setShowPrintPreview(true);
//     } catch (error) {
//       console.error('Error placing order:', error);
//     }
//   };

//   const componentRef = useRef();

//   const handleReactToPrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     let newTotalAmount = 0;
//     cart.forEach(item => {
//       newTotalAmount += item.totalAmount;
//     });
//     setTotalAmount(newTotalAmount);
//   }, [cart]);

//   return (
//     <MainLayout>
//       <div className='row px-5'>
//         <div className='col-lg-6'>
//           {isLoading ? 'Loading' : <div className='row'>
//             {products.map((product, key) =>
//               <div key={key} className='col-lg-4 mb-4 bg'>
//                 <div className='pos-item px-3 text-center border' onClick={() => addProductToCart(product)}>
//                   <h3>{product.name}</h3>
//                   <img src={product.image} className="img-fluid" alt={product.name} />
//                   <p>{product.price} L.L</p>
//                 </div>
//               </div>
//             )}
//           </div>}
//         </div>
//         <div className='col-lg-6'>
//           <div className='table-responsive bg-dark'>
//             <table className='table table-responsive table-dark table-hover'>
//               <thead>
//                 <tr>
//                   <td>Name</td>
//                   <td>Price</td>
//                   <td>Qty</td>
//                   <td>Total</td>
//                   <td>Action</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((cartProduct, key) => (
//                   <tr key={key}>
//                     <td>{cartProduct.name}</td>
//                     <td>{cartProduct.price}</td>
//                     <td>{cartProduct.quantity}</td>
//                     <td>{cartProduct.totalAmount}</td>
//                     <td>
//                       <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct._id)}>Remove</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <h2 className='px-2 text-white'>Total Amount: L.L {totalAmount.toLocaleString()}</h2>
//           </div>
//           <div className='mt-3'>
//           {totalAmount !== 0 ? <div>
//               <button className='btn btn-primary' onClick={placeOrder}>
//                 Place Order
//               </button>
//             </div> : 'Please add a product to the cart'}
//           </div>
//           <div style={{ display: showPrintPreview && cart.length > 0 ? "block" : "none" }}>
//             <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef} />
//           </div>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// export default POSPage;

// import React, { useEffect, useRef, useState } from 'react';
// import MainLayout from '../layouts/MainLayout';
// import axios from "axios";
// import { toast } from 'react-toastify';
// import { ComponentToPrint } from '../components/ComponentToPrint';
// import { useReactToPrint } from 'react-to-print';
// import { Modal, Button } from 'react-bootstrap';

// function POSPage() {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [cart, setCart] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [showPrintPreview, setShowPrintPreview] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const toastOptions = {
//     autoClose: 400,
//     pauseOnHover: true,
//   };

//   const fetchProducts = async () => {
//     setIsLoading(true);
//     const result = await axios.get('http://localhost:5000/products');
//     setProducts(await result.data);
//     setIsLoading(false);
//   };

//   const addProductToCart = (product) => {
//     const existingCartItemIndex = cart.findIndex(item => item._id === product._id);
//     if (existingCartItemIndex !== -1) {
//       const updatedCart = [...cart];
//       updatedCart[existingCartItemIndex].quantity++;
//       updatedCart[existingCartItemIndex].totalAmount += product.price;
//       setCart(updatedCart);
//     } else {
//       const newCartItem = {
//         ...product,
//         quantity: 1,
//         totalAmount: product.price, // Set initial totalAmount to product price
//       };
//       setCart(prevCart => [...prevCart, newCartItem]);
//     }
//     toast(`Added ${product.name} to cart`, toastOptions);
//   };

//   const removeProduct = (productId) => {
//     const updatedCart = cart.filter(item => item._id !== productId);
//     setCart(updatedCart);
//   };

//   const placeOrder = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/orders/new', {
//         items: cart.map(item => ({
//           productId: item._id,
//           quantity: item.quantity,
//           price: item.price
//         })),
//         totalAmount
//       });
//       console.log('Order placed successfully:', response.data);
//       console.log('Items:', response.data.items);
//       setShowModal(true);
//       setCart([]);
//       setTotalAmount(0);
//     } catch (error) {
//       console.error('Error placing order:', error);
//     }
//   };

//   const componentRef = useRef();

//   const handleReactToPrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     let newTotalAmount = 0;
//     cart.forEach(item => {
//       newTotalAmount += item.totalAmount;
//     });
//     setTotalAmount(newTotalAmount);
//   }, [cart]);

//   const handleCloseModal = () => setShowModal(false);

//   return (
//     <MainLayout>
//       <div className='row px-5'>
//         <div className='col-lg-6'>
//           {isLoading ? 'Loading' : <div className='row'>
//             {products.map((product, key) =>
//               <div key={key} className='col-lg-4 mb-4 bg'>
//                 <div className='pos-item px-3 text-center border' onClick={() => addProductToCart(product)}>
//                   <h3>{product.name}</h3>
//                   <img src={product.image} className="img-fluid" alt={product.name} />
//                   <p>{product.price} L.L</p>
//                 </div>
//               </div>
//             )}
//           </div>}
//         </div>
//         <div className='col-lg-6'>
//           <div className='table-responsive bg-dark'>
//             <table className='table table-responsive table-dark table-hover'>
//               <thead>
//                 <tr>
//                   <td>Name</td>
//                   <td>Price</td>
//                   <td>Qty</td>
//                   <td>Total</td>
//                   <td>Action</td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {cart.map((cartProduct, key) => (
//                   <tr key={key}>
//                     <td>{cartProduct.name}</td>
//                     <td>{cartProduct.price}</td>
//                     <td>{cartProduct.quantity}</td>
//                     <td>{cartProduct.totalAmount}</td>
//                     <td>
//                       <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct._id)}>Remove</button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <h2 className='px-2 text-white'>Total Amount: L.L {totalAmount.toLocaleString()}</h2>
//           </div>
//           <div className='mt-3'>
//             {totalAmount !== 0 ? <div>
//               <button className='btn btn-primary' onClick={placeOrder}>
//                 Place Order
//               </button>
//             </div> : 'Please add a product to the cart'}
//           </div>
//           <Modal show={showModal} onHide={handleCloseModal}>
//             <Modal.Header closeButton>
//               <Modal.Title>Order Placed Successfully!</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <ComponentToPrint cart={cart} totalAmount={totalAmount} ref={componentRef} />
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleCloseModal}>
//                 Close
//               </Button>
//               <Button variant="primary" onClick={handleReactToPrint}>
//                 Print
//               </Button>
//             </Modal.Footer>
//           </Modal>
//         </div>
//       </div>
//     </MainLayout>
//   );
// }

// export default POSPage;

import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";
import { toast } from "react-toastify";
import { ComponentToPrint } from "../components/ComponentToPrint";
import { useReactToPrint } from "react-to-print";
import { Modal, Button } from "react-bootstrap";

function POSPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toastOptions = {
    autoClose: 400,
    pauseOnHover: true,
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const result = await axios.get("http://localhost:5000/products");
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
    toast(`Added ${product.name} to cart`, toastOptions);
  };

  const removeProduct = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post("http://localhost:5000/orders/new", {
        items: cart.map((item) => ({
          name: item.name,
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
      });

      setOrderResponse(response.data);

      console.log("Order placed successfully:", response.data);
      console.log("Items:", response.data.items);
      setShowModal(true);
      setCart([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const componentRef = useRef();
  const [orderResponse, setOrderResponse] = useState(null);

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
    <MainLayout>
      <div className="row px-5">
        <div className="col-lg-6">
          {isLoading ? (
            "Loading"
          ) : (
            <div className="row">
              {products.map((product, key) => (
                <div key={key} className="col-lg-4 mb-4 bg">
                  <div
                    className="pos-item px-3 text-center border"
                    onClick={() => addProductToCart(product)}
                  >
                    <h3>{product.name}</h3>
                    <img src={product.image} className="img-fluid" alt="" />
                    <p>{product.price} L.L</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-lg-6">
          <div className="table-responsive bg-dark">
            <table className="table table-responsive table-dark table-hover">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Price</td>
                  <td>Qty</td>
                  <td>Total</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {cart.map((cartProduct, key) => (
                  <tr key={key}>
                    <td>{cartProduct.name}</td>
                    <td>{cartProduct.price}</td>
                    <td>{cartProduct.quantity}</td>
                    <td>{cartProduct.totalAmount}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeProduct(cartProduct._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="px-2 text-white">
              Total Amount: L.L {totalAmount.toLocaleString()}
            </h2>
          </div>
          <div className="mt-3">
            {totalAmount !== 0 ? (
              <div>
                <button className="btn btn-primary" onClick={placeOrder}>
                  Place Order
                </button>
              </div>
            ) : (
              "Please add a product to the cart"
            )}
          </div>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Order Placed Successfully!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h2>Total : {orderResponse.totalAmount.toLocaleString()}</h2>

              {/* {orderResponse && (
                <ComponentToPrint
                  cart={orderResponse.items}
                  totalAmount={orderResponse.totalAmount.toLocaleString()}
                  ref={componentRef}
                />
              )} */}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleReactToPrint}>
                Print
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </MainLayout>
  );
}

export default POSPage;
