import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Sellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/seller/all");
        if (!response.ok) throw new Error("Failed to fetch sellers");
        const data = await response.json();
        setSellers(data.data.sellers); // Assuming response has { sellers: [...] }
      } catch (error) {
        console.error("Error fetching sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  console.log(sellers);

  const handleSellerClick = (sellerId) => {
    navigate(`/dummy-chat/${sellerId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sellers List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sellers.length === 0 ? (
          <p className="text-gray-500">No sellers found</p>
        ) : (
          sellers.map((seller) => (
            <div
              key={seller._id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleSellerClick(seller._id)}
            >
              <h2 className="text-lg font-semibold">{seller.name}</h2>
              <p className="text-gray-600">{seller.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sellers;
