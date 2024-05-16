import React, { useState, useEffect } from "react";
import axios from "axios";

const AddNewProducts = () => {
  const [products, setProducts] = useState(() => {
    const storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null,
    isUploading: false, // Indicates if the upload is in progress
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://pos-backend-on9v.onrender.com/products"
      );
      const sortedProducts = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setProducts(sortedProducts);
      localStorage.setItem("products", JSON.stringify(sortedProducts));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setNewProduct({ ...newProduct, image: file });
  };

  const addProduct = async () => {
    try {
      setNewProduct({ ...newProduct, isUploading: true }); // Set uploading state to true
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("image", newProduct.image);

      const response = await axios.post(
        "https://pos-backend-on9v.onrender.com/products/new",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const updatedProducts = [response.data, ...products];
      setProducts([response.data, ...products]); // Update state with sorted products
      localStorage.setItem("products", JSON.stringify(updatedProducts)); // Update localStorage
      setNewProduct({ name: "", price: "", image: null, isUploading: false }); // Reset form fields
    } catch (error) {
      console.error("Error adding product:", error);
      setNewProduct({ ...newProduct, isUploading: false }); // Reset uploading state on error
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(
        `https://pos-backend-on9v.onrender.com/products/${productId}`
      );
      const updatedProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEditing = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    setNewProduct({
      name: productToEdit.name,
      price: productToEdit.price,
      image: productToEdit.image,
    });
    setEditProduct(productId);
  };

  const cancelEditing = () => {
    setEditProduct(null);
  };

  const saveProduct = async (productId, updatedFields) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedFields.name);
      formData.append("price", updatedFields.price);
      formData.append("image", updatedFields.image);

      await axios.put(
        `https://pos-backend-on9v.onrender.com/products/${productId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fetchProducts();
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="main-container flex flex-col md:flex-row justify-between items-start">
      <div
        className=" flex flex-col md:sticky top-2 col-1 w-full md:w-1/4 items-center mr-3 gap-2 p-4"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <h2 className="mb-4 text-3xl font-semibold">Add New Item</h2>
        <label className="mb-2">
          Item name:
          <input
            type="text"
            className="mb-2 mt-1 rounded-md p-1 block border border-gray-700"
            name="name"
            placeholder="Name"
            value={newProduct.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className="mb-2">
          Item price:
          <input
            type="number"
            className="mb-2 mt-1 rounded-md p-1 block border border-gray-700"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </label>
        <label
          className="flex flex-wrap cursor-pointer appearance-none justify-center rounded-md border border-dashed border-gray-300 px-3 py-6 text-sm transition hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-75 mb-4"
          tabIndex="0"
          style={{ maxWidth: "300px" }} // Adjust the maximum width as needed
        >
          <span htmlFor="photo-dropbox" className="flex items-center space-x-2">
            {newProduct.image ? (
              <span className="text-xs font-medium text-green-500 truncate">
                image uploaded
              </span>
            ) : (
              <svg className="h-6 w-6 stroke-gray-400" viewBox="0 0 256 256">
                <path
                  d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></path>
                <path
                  d="M80,128a80,80,0,1,1,144,48"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></path>
                <polyline
                  points="118.1 161.9 152 128 185.9 161.9"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></polyline>
                <line
                  x1="152"
                  y1="208"
                  x2="152"
                  y2="128"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="24"
                ></line>
              </svg>
            )}
            <span className="flex flex-wrap text-xs font-medium text-gray-300">
              {newProduct.image ? "File Selected" : "Drop files to Attach, or"}{" "}
              <span className="text-blue-600 underline">browse</span>
            </span>
          </span>
          <input
            type="file"
            className="sr-only"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </label>

        <div>
          <button onClick={addProduct} disabled={newProduct.isUploading}>
            {newProduct.isUploading ? "Uploading..." : "Add Item"}
          </button>
        </div>
      </div>

      <div className="col-2 w-full md:w-3/4 mt-4">
        <h2 className="text-3xl font-semibold mb-4">Items List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5 gap-8">
          {products.map((product) => (
            <div key={product._id}>
              <div className=" border border-gray-500 rounded-lg overflow-hidden p-2">
                <img
                  src={`https://pos-backend-on9v.onrender.com/${product.image}`}
                  alt={product.name}
                  className="w-full h-64 object-contain"
                />
                {editProduct === product._id ? (
                  <div className="p-4">
                    <input
                      type="text"
                      value={newProduct.name}
                      name="name"
                      onChange={handleInputChange}
                      required
                      className="mb-2 rounded-md p-1 block w-full border border-gray-700"
                      placeholder="Product Name"
                    />
                    <input
                      type="number"
                      value={newProduct.price}
                      name="price"
                      onChange={handleInputChange}
                      required
                      className="mb-2 rounded-md p-1 block w-full border border-gray-700"
                      placeholder="Price"
                    />
                    <div className="my-4">
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
                      />
                    </div>
                    <div className="flex justify-between">
                      <button
                        onClick={() => saveProduct(product._id, newProduct)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="text-lg font-bold mb-2">{product.name}</p>
                    <p className="text-gray-400">L.L {product.price}</p>
                  </div>
                )}
                <div className="py-4 px-1 border-t border-gray-700">
                  <div className="flex justify-between">
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEditing(product._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddNewProducts;
