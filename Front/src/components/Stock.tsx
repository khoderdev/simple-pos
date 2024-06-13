import { useAtom } from "jotai/react";
import { useNavigate } from "react-router-dom";
import { productsAtom } from "../States/store";
import * as XLSX from "xlsx";

const Stock = () => {
  const [products] = useAtom(productsAtom);
  const navigate = useNavigate();

  const exportToExcel = () => {
    const worksheetData = products.map((product) => ({
      Name: product.name,
      Price: product.price,
      Quantity: product.quantity,
    //   ImageURL: `http://localhost:5200/${product.image}`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock");
    XLSX.writeFile(workbook, "StockReport.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl text-center font-semibold mb-4">Stock Report</h2>
      <div className="flex w-full justify-end gap-4">
        <button
          onClick={() => navigate("/inventory")}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add new items
        </button>
        <button
          onClick={exportToExcel}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-300">Item</th>
              <th className="text-left py-2 px-4 border-b border-gray-300">
                Name
              </th>
              <th className="text-left py-2 px-4 border-b border-gray-300">
                Price
              </th>
              <th className="text-left py-2 px-4 border-b border-gray-300">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="py-2 px-4 border-b border-gray-300">
                  <img
                    src={`http://localhost:5200/${product.image}`}
                    alt={product.name}
                    className="w-20 h-20 object-contain mx-auto"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {product.name}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  L.L {product.price}
                </td>
                <td className="py-2 px-4 border-b border-gray-300">
                  {product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
