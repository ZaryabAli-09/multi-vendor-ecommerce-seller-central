import { useState, useEffect } from "react";

import StarRating from "../../../components/common ui comps/StarRating.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import ProductSlider from "../../../components/common ui comps/productSlider.jsx";

import { toast } from "react-hot-toast";
function Product() {
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { productId } = useParams();
  const naviage = useNavigate();
  console.log(product);

  async function fetchProduct() {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/product/single/${productId}`
      );
      if (!response.ok) throw new Error("Failed to fetch product details");
      const data = await response.json();
      setProduct(data.data);
    } catch (error) {
      toast.error(error.message);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <main className={`relative flex justify-center items-center }`}>
        <span className="text-6xl text-pink-600 font-bold">Loading...</span>
      </main>
    );
  } else if (error) {
    return (
      <main className="flex justify-center items-center h-screen">
        <p>Something went wrong. Please try again.</p>
      </main>
    );
  } else if (product) {
    return (
      <main className="py-14 px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:h-96 gap-6">
          <div className="w-full lg:w-1/2  lg:h-full">
            <ProductSlider sliderImgs={product.images} />
          </div>
          <div className="flex flex-col gap-5 w-full lg:w-1/2 px-4">
            <h1 className="text-2xl font-medium">
              {product.name.toUpperCase()}
            </h1>
            <StarRating
              rating={product.rating}
              numReviews={product.numReviews}
            />
            <span>
              {product.categories?.map((category, index) => (
                <span key={category._id}>
                  {category.name}
                  {index < product.categories.length - 1 ? " > " : ""}
                </span>
              ))}
            </span>
            <span className="text-3xl text-gray-700 font-semibold">
              Price: ${product.discountedPrice || product.price}
            </span>
            <span className="text-xl text-gray-600">
              In Stock: {product.countInStock}
            </span>
            <span className="text-xl text-gray-600">Sold: {product.sold}</span>
            <details>
              <summary className="text-xl font-semibold">Description</summary>
              <p className="text-gray-700">{product.description}</p>
            </details>
          </div>
        </div>
      </main>
    );
  }
}

export default Product;
