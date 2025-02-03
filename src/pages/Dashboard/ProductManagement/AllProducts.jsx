import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserFromServer = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/product/seller-products`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const result = await res.json();

        if (!res.ok) {
          toast.error(result.message);
        } else {
          setProducts(result.data);
          toast.success(result.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchUserFromServer();
  }, [user._id]);

  // Handle Edit Product
  const handleEdit = (productId) => {
    console.log("Edit product:", productId);
    // Add your edit logic here
  };

  // Handle Delete Product
  const handleDelete = (productId) => {
    console.log("Delete product:", productId);
    // Add your delete logic here
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">All Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Image
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Stock
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Categories
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Sold
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                <td className="px-4 py-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <Link
                    to={`/dashboard/product/${product._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>

                <td className="px-4 py-3 text-sm text-gray-700">
                  {product.countInStock}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {product.categories.map((category) => {
                    return <div className="text-xs">{category.name}</div>;
                  })}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ${product.price}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {product.sold}
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => handleEdit(product._id)}
                    className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllProducts;
