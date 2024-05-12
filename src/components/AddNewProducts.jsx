// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AddNewProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     price: "",
//     image: "",
//   });

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/products");
//       setProducts(response.data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewProduct({ ...newProduct, [name]: value });
//   };

//   const addProduct = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/products/new",
//         newProduct
//       );
//       setProducts([...products, response.data]);
//       setNewProduct({ name: "", price: "", image: "" });
//     } catch (error) {
//       console.error("Error adding product:", error);
//     }
//   };

//   return (
//     <div className="add-products-row">
//       <h2>Add New Product</h2>
//       <div className="col">
//         <div className="col-md- mb-2">
//           <input
//             type="text"
//             className="form-control"
//             name="name"
//             placeholder="Name"
//             value={newProduct.name}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div className="col-md- mb-2">
//           <input
//             type="number"
//             className="form-control"
//             name="price"
//             placeholder="Price"
//             value={newProduct.price}
//             onChange={handleInputChange}
//             required
//           />
//         </div>

//         <div className="col-md-12">
//           <button className="btn btn-primary" onClick={addProduct}>
//             Add Product
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddNewProducts;

import React, { useState, useEffect } from "react";
import axios from "axios";

const AddNewProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null, // Updated to store the image file
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Function to handle image file selection
  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const addProduct = async () => {
    try {
      // Create form data to send image file
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("image", newProduct.image);

      // Send POST request with form data
      const response = await axios.post(
        "http://localhost:5000/products/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProducts([...products, response.data]);
      setNewProduct({ name: "", price: "", image: null });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="add-products-row">
      <h2>Add New Product</h2>
      <div className="col">
        <div className="col-md- mb-2">
          <input
            type="text"
            className="form-control"
            name="name"
            placeholder="Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md- mb-2">
          <input
            type="number"
            className="form-control"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="col-md- mb-2">
          <input
            type="file" 
            className="form-control"
            name="image"
            accept="image/*" 
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="col-md-12">
          <button className="btn btn-primary" onClick={addProduct}>
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProducts;
