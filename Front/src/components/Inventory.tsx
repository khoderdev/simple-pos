import { useState, useEffect } from "react";
import axios from "axios";
import { useAtom } from "jotai/react";
import { productsAtom } from "../States/store";
import { NewProduct, Product } from "../types/AllTypes";
import { BsFillGrid3X3GapFill } from "react-icons/bs";


const AddNewProducts = () => {
  const [products, setProducts] = useAtom(productsAtom);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    price: 0,
    quantity: 0,
    image: null,
    isUploading: false,
  });
  const [editProduct, setEditProduct] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "rows">("grid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setModalMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(
        "http://localhost:5200/products"
      );
      const sortedProducts = response.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(sortedProducts);
      localStorage.setItem("products", JSON.stringify(sortedProducts));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
  };

  const addProduct = async () => {
    try {
      setNewProduct({ ...newProduct, isUploading: true });
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price.toString());
      formData.append("quantity", newProduct.quantity.toString());
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const response = await axios.post<Product>(
        "http://localhost:5200/products/new",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const updatedProducts = [response.data, ...products];
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setNewProduct({
        name: "",
        price: 0,
        quantity: 0,
        image: null,
        isUploading: false,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      setNewProduct({ ...newProduct, isUploading: false });
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5200/products/${productId}`);
      const updatedProducts = products.filter(
        (product) => product._id !== productId
      );
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const startEditing = (productId: string) => {
    const productToEdit = products.find((product) => product._id === productId);
    if (productToEdit) {
      setNewProduct({
        name: productToEdit.name,
        price: productToEdit.price,
        quantity: productToEdit.quantity,
        image: productToEdit.image,
        isUploading: false,
      });
      setEditProduct(productId);
    }
  };

  const cancelEditing = () => {
    setEditProduct(null);
    // Clear the inputs after canceling editing
    setNewProduct({
      name: "",
      price: 0,
      quantity: 0,
      image: null,
      isUploading: false,
    });
  };

  const saveProduct = async (
    productId: string,
    updatedFields: Partial<Product>
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedFields.name || "");
      formData.append("price", (updatedFields.price || 0).toString());
      formData.append("quantity", (updatedFields.quantity || 0).toString());
      if (updatedFields.image) {
        formData.append("image", updatedFields.image);
      }

      await axios.put(`http://localhost:5200/products/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchProducts();
      setEditProduct(null);
      // Clear the inputs after saving
      setNewProduct({
        name: "",
        price: 0,
        quantity: 0,
        image: null,
        isUploading: false,
      });
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const fileToDataURL = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="main-container flex flex-col md:flex-row justify-between items-start">
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-black-bg rounded-lg w-full md:max-w-md mx-4 md:mx-0 p-4">
            <div className="flex justify-end w-full">
              <button
                className="text-lg text-red-500 order-last"
                onClick={handleCloseModal}
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col items-center gap-2">
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
              <label className="mb-2">
                Quantity:
                <input
                  type="number"
                  className="mb-2 mt-1 rounded-md p-1 block border border-gray-700"
                  name="quantity"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label
                className="flex flex-wrap cursor-pointer appearance-none justify-center rounded-md border border-dashed border-gray-300 px-3 py-6 text-sm transition hover:border-gray-400 focus:border-solid focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:opacity-75 mb-4"
                style={{ maxWidth: "300px" }}
              >
                <label
                  htmlFor="photo-dropbox"
                  className="flex items-center space-x-2"
                >
                  {newProduct.image ? (
                    <span className="text-xs font-medium text-green-500 truncate">
                      image uploaded
                    </span>
                  ) : (
                    <svg
                      className="h-6 w-6 stroke-gray-400"
                      viewBox="0 0 256 256"
                    >
                      <path
                        d="M96,208H72A56,56,0,0,1,72,96a57.5,57.5,0,0,1,13.9,1.7"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></path>
                      <path
                        d="M80,128a80,80,0,1,1,144,48"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></path>
                      <polyline
                        points="118.1 161.9 152 128 185.9 161.9"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></polyline>
                      <line
                        x1="152"
                        y1="208"
                        x2="152"
                        y2="128"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="24"
                      ></line>
                    </svg>
                  )}
                  <span className="flex flex-wrap text-xs font-medium text-gray-300">
                    {newProduct.image
                      ? "File Selected"
                      : "Drop files to Attach, or"}{" "}
                    <span className="text-blue-600 underline">browse</span>
                  </span>
                </label>

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
                <button
                  onClick={addProduct}
                  disabled={newProduct.isUploading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {newProduct.isUploading ? "Uploading..." : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="col-2 w-full p-6">
        <div className="flex justify-end mb-4 gap-4 items-center">
          {/* Button to open modal */}
          <button
            className="text-sm px-4 py-2 rounded bg-green-500"
            onClick={toggleModal}
          >
            Add New Item
          </button>
          <button
            className={`text-sm px-4 py-2 rounded ${
              viewMode === "grid"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } mr-2`}
            onClick={() => setViewMode("grid")}
          >
            Grid View
          </button>
          <button
            className={`text-sm px-4 py-2 rounded ${
              viewMode === "rows"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
            onClick={() => setViewMode("rows")}
          >
            Rows View
          </button>
        </div>

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 3xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <div key={product._id}>
                <div className="border border-gray-500 rounded-lg overflow-hidden p-2">
                  <img
                    src={`http://localhost:5200/${product.image}`}
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
                      <input
                        type="number"
                        value={newProduct.quantity}
                        name="quantity"
                        onChange={handleInputChange}
                        required
                        className="mb-2 rounded-md p-1 block w-full border border-gray-700"
                        placeholder="Quantity"
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
                          onClick={async () => {
                            const updatedImage =
                              newProduct.image instanceof File
                                ? await fileToDataURL(newProduct.image)
                                : null;
                            saveProduct(product._id, {
                              name: newProduct.name,
                              price: newProduct.price,
                              quantity: newProduct.quantity,
                              image: updatedImage,
                            });
                          }}
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
                      <p className="text-gray-400">
                        Quantity: {product.quantity}
                      </p>
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
        )}

        {viewMode === "rows" && (
          <div>
            {products.map((product) => (
              <div key={product._id} className="mb-4">
                <div className="border border-gray-500 rounded-lg overflow-hidden p-2 flex">
                  <img
                    src={`http://localhost:5200/${product.image}`}
                    alt={product.name}
                    className="w-32 h-32 object-contain mr-4"
                  />
                  <div className="flex-grow">
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
                        <input
                          type="number"
                          value={newProduct.quantity}
                          name="quantity"
                          onChange={handleInputChange}
                          required
                          className="mb-2 rounded-md p-1 block w-full border border-gray-700"
                          placeholder="Quantity"
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
                            onClick={async () => {
                              const updatedImage =
                                newProduct.image instanceof File
                                  ? await fileToDataURL(newProduct.image)
                                  : null;
                              saveProduct(product._id, {
                                name: newProduct.name,
                                price: newProduct.price,
                                quantity: newProduct.quantity,
                                image: updatedImage,
                              });
                            }}
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
                        <p className="text-gray-400">
                          Quantity: {product.quantity}
                        </p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProducts;
