import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const NavbarSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length === 0) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/product/search?query=${value}&limit=10`
      );
      const data = await res.json();

      if (data.status === "success") {
        setSuggestions(data.data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error(error.message); // Or toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (productId) => {
    navigate(`/product/${productId}`);
    setSearchTerm("");
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="flex items-center border rounded bg-slate-100 px-2 focus-within:ring-2 focus-within:ring-red-200">
        <input
          type="text"
          className="flex-grow bg-transparent p-2 focus:outline-none"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => searchTerm && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        />
        {loading && <FaSpinner className="animate-spin text-red-500 ml-2" />}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border rounded mt-1 max-h-80 overflow-y-auto shadow-xl">
          {suggestions.map((product) => (
            <li
              key={product._id}
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(product._id)}
            >
              <img
                src={
                  product.variants?.[0]?.images?.[0]?.url ||
                  "https://via.placeholder.com/40"
                }
                alt={product.name}
                className="w-10 h-10 object-cover rounded"
              />
              <span className="text-gray-800">{product.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavbarSearch;
