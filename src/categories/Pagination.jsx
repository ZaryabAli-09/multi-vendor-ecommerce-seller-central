import react from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Pagination = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 3,
    totalPages: 0,
  });

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/api/product/pagination?page=${pagination.page}&limit=${pagination.limit}`
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      setProducts(data.products);
      setPagination((prev) => ({
        ...prev,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePageChange(newPage) {
    setPagination((prev) => {
      return {
        ...prev,
        page: newPage,
      };
    });
  }

  useEffect(() => {
    fetchProducts();
  }, [pagination.page]);

  if (loading)
    return (
      <div className="w-full h-[100vh] animate-bounce text-2xl flex items-center justify-center bg-opacity-30">
        Loading.....
      </div>
    );

  return (
    <>
      <div>
        {products?.length <= 0 ? (
          <div>No products found</div>
        ) : (
          products.map((item) => {
            return (
              <div
                key={item._id}
                className="bg-black p-5 text-white rounded-md shadow-lg"
              >
                <ul>
                  <li>ProductId : {item._id}</li>
                  <li>ProductName : {item.name}</li>
                </ul>
              </div>
            );
          })
        )}
      </div>
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <nav className="flex items-center space-x-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    pagination.page === page
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Pagination;
