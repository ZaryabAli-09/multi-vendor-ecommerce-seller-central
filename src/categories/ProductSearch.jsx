import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    sortBy: "recent",
    minPrice: 0,
    maxPrice: 10000,
    priceFilter: [0, 10000],
  });

  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    searchInputRef.current.focus();
    const params = new URLSearchParams(location.search);
    const query = params.get("q");

    if (query) {
      setSearchQuery(query);
      fetchProducts(query, 1, true);
    }

    fetchPriceRange();
  }, [location.search]);

  const fetchPriceRange = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product/price-range");
      if (!res.ok) throw new Error("Failed to fetch price range");
      const data = await res.json();

      if (data.status === "success") {
        setFilters((prev) => ({
          ...prev,
          minPrice: data.data.minPrice,
          maxPrice: data.data.maxPrice,
          priceFilter: [data.data.minPrice, data.data.maxPrice],
        }));
      }
    } catch (error) {
      console.error("Error fetching price range:", error);
    }
  };

  const buildSearchParams = (pageNum) => {
    return new URLSearchParams({
      query: searchQuery.trim(),
      page: pageNum.toString(),
      limit: "10",
      sortBy: filters.sortBy,
      minPrice: filters.priceFilter[0].toString(),
      maxPrice: filters.priceFilter[1].toString(),
    });
  };

  const fetchProducts = async (pageNum = 1, reset = false) => {
    const query = searchQuery.trim();
    if (!query) {
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
      return;
    }

    try {
      setLoading(true);
      const params = buildSearchParams(pageNum);
      const res = await fetch(
        `http://localhost:5000/api/product/search?${params}`
      );

      if (!res.ok) throw new Error("Search request failed");
      const data = await res.json();

      if (data.status === "success") {
        setProducts(data.data.products);
        setTotalProducts(data.data.totalProducts);
        setTotalPages(data.data.totalPages);
        if (reset) setPage(1);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((query) => {
    navigate(`/products-search?q=${encodeURIComponent(query)}`);
    fetchProducts(1, true);
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const updateFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
    fetchProducts(1, true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchProducts(newPage);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            &laquo;
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            &lsaquo;
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }

            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded border ${
                  page === pageNum ? "bg-blue-500 text-white" : ""
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            &rsaquo;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            &raquo;
          </button>
        </nav>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-sm sticky top-4">
            <h3 className="font-bold text-lg mb-4">Filters</h3>

            {/* Sort By */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full border rounded p-2 text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Low to High</option>
                <option value="price-high">High to Low</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Price Range</h4>
              <div className="flex justify-between mb-2">
                <span>Rs. {filters.priceFilter[0].toLocaleString()}</span>
                <span>Rs. {filters.priceFilter[1].toLocaleString()}</span>
              </div>
              <Slider
                range
                min={filters.minPrice}
                max={filters.maxPrice}
                value={filters.priceFilter}
                onChange={(value) => updateFilter("priceFilter", value)}
                trackStyle={[{ backgroundColor: "#3b82f6" }]}
                handleStyle={[
                  { borderColor: "#3b82f6", backgroundColor: "#fff" },
                  { borderColor: "#3b82f6", backgroundColor: "#fff" },
                ]}
                activeDotStyle={{ borderColor: "#3b82f6" }}
                railStyle={{ backgroundColor: "#e5e7eb" }}
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="flex-1">
          <div className="mb-6">
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 text-lg"
            />
            {totalProducts > 0 && (
              <p className="text-gray-600 mt-2">
                {totalProducts} {totalProducts === 1 ? "result" : "results"}{" "}
                found
                {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-800">
                {searchQuery ? "No products found" : "Start typing to search"}
              </h3>
              <p className="text-gray-600 mt-2">
                {searchQuery
                  ? "Try different keywords or filters"
                  : "Search for products by name or description"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <img
                      src={
                        product.variants[0]?.images[0]?.url ||
                        "/placeholder.jpg"
                      }
                      alt={product.name}
                      className="w-full h-52 object-cover rounded-t-lg"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600 font-semibold">
                          Rs. {product.variants[0]?.price.toLocaleString()}
                        </span>
                        {product.variants[0]?.discountedPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            Rs.{" "}
                            {product.variants[0]?.discountedPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
