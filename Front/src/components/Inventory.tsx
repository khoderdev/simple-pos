import { useState, useEffect } from "react";
import axios from "axios";

const AddNewProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: null,
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://192.168.43.138:5000/products");
      setProducts(response.data);
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

  const addProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("image", newProduct.image);

      const response = await axios.post(
        "http://192.168.43.138:5000/products/new",
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

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://192.168.43.138:5000/products/${productId}`);
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
        `http://192.168.43.138:5000/products/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchProducts();
      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col md:w-1/2 mr-4">
        <h2 className="mb-4">Add New Product</h2>
        <div className="mb-2">
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
        <div className="mb-2">
          <input
            type="number"
            className="text-gray-400"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-2">
          <input
            type="file"
            className="form-control"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <button onClick={addProduct}>Add Product</button>
        </div>
      </div>

      <div className="w-2/3">
        <h2 className="text-3xl mb-4">Products</h2>
        <div className="grid grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id}>
              <div className="border border-gray-500 rounded-lg overflow-hidden">
                <img
                  src={`http://192.168.43.138:5000/${product.image}`}
                  alt={product.name}
                  className="w-96 h-"
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
                        onClick={() =>
                          saveProduct(product._id, newProduct)
                        }
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
                    <p className="text-gray-400">${product.price}</p>
                  </div>
                )}
                <div className="p-4 border-t border-gray-700">
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
