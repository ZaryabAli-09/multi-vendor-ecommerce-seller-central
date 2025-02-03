import { Input } from "../../../components/common ui comps/Input";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/common ui comps/Button";

const schema = yup.object({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("product description is required"),
  price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .required("Product price is required")
    .typeError("Product price must be a number"),
  discountedPrice: yup
    .number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? null : value
    )
    .nullable(),
  countInStock: yup
    .number()
    .transform((value, originalValue) =>
      originalValue.trim() === "" ? 1 : value
    )
    .required("Please enter product stocks")
    .typeError("Stocks must be a number"),
});

const AllProducts = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Allows setting form values programmatically
  } = useForm({
    resolver: yupResolver,
  });
  const [allCatgories, setAllCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [isVariable, setIsVariable] = useState(false);

  const [variants, setVariants] = useState([
    { size: "", color: "", stock: "" },
  ]);
  const [products, setProducts] = useState([]);
  const [editPopUp, setEditPopUp] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Handler for main category selection
  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCategory = allCatgories.find((cat) => cat._id === selectedId);
    setSelectedMainCategory(selectedCategory);
    setSelectedSubCategory(null); // Reset subcategory when main category changes
    setSelectedSubSubCategory(null); // Reset sub-subcategory
  };

  // Handler for subcategory selection

  const handleSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedSubCat = selectedMainCategory.subCategories.find(
      (subCat) => subCat._id === selectedId
    );
    setSelectedSubCategory(selectedSubCat);
    setSelectedSubSubCategory(null); // Reset sub-subcategory
  };

  // Handler for sub-subcategory selection
  const handleSubSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedSubSubCat = selectedSubCategory.subCategories.find(
      (subSubCat) => subSubCat._id === selectedId
    );
    setSelectedSubSubCategory(selectedSubSubCat);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/categories`
      );

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      } else {
        setAllCategories(result.data);

        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
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

    fetchProducts();
  }, [user._id]);

  // Handle Delete Product
  const handleDelete = async (productId) => {
    console.log("Delete product:", productId);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/delete/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
      } else {
        setProducts(
          products.filter((product) => {
            return product._id !== productId;
          })
        );
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    // Add your delete logic here
  };

  const fetchSingleProduct = async (productId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/single/${productId}`
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      } else {
        setValue("name", result.data.name);
        setValue("description", result.data.description);
        setValue("price", result.data.price);
        setValue("discountedPrice", result.data.discountedPrice);
        setValue("countInStock", result.data.countInStock);
        setIsVariable(result.data.isVariable);

        // First, set the main category
        const mainCategory = allCatgories.find(
          (cat) => result.data.categories[0]._id === cat._id
        );
        setSelectedMainCategory(mainCategory);

        // Wait for the state to update, then set the subcategory
        setTimeout(() => {
          if (!mainCategory) return;
          const subCategory = mainCategory.subCategories.find(
            (cat) => result.data.categories[1]._id === cat._id
          );
          setSelectedSubCategory(subCategory);

          // Wait for the subCategory to update, then set the sub-subcategory
          setTimeout(() => {
            if (!subCategory) return;
            const subSubCategory = subCategory.subCategories.find(
              (cat) => result.data.categories[2]._id === cat._id
            );
            setSelectedSubSubCategory(subSubCategory);
          }, 0);
        }, 0);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  console.log(
    selectedMainCategory,
    selectedSubCategory,
    selectedSubSubCategory
  );
  // Handle Edit Product
  const handleEdit = async (productId) => {
    console.log("Edit product:", productId);
    setEditPopUp(true);
    fetchSingleProduct(productId);

    // Add your edit logic here
  };
  const handleAddVariant = () => {
    if (!isVariable) {
      setIsVariable(true);
      setVariants([{ size: "", color: "", stock: "" }]);
    } else {
      setVariants([...variants, { size: "", color: "", stock: "" }]);
    }
  };
  return (
    <>
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
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {index + 1}
                  </td>
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

                  <td
                    disabled={!isVariable}
                    className="px-4 py-3 text-sm text-gray-700"
                  >
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

      {editPopUp && (
        <div className=" w-72">
          {/* Main Category Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Main Category
            </label>
            <select
              value={selectedMainCategory?._id || ""}
              onChange={handleMainCategoryChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Select a main category</option>
              {allCatgories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {/* Subcategory Dropdown (Conditional) */}
          {selectedMainCategory &&
            selectedMainCategory.subCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subcategory
                </label>
                <select
                  value={selectedSubCategory?._id || ""}
                  onChange={handleSubCategoryChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a subcategory</option>
                  {selectedMainCategory.subCategories.map((subCat) => (
                    <option key={subCat._id} value={subCat._id}>
                      {subCat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          {/* Sub-Subcategory Dropdown (Conditional) */}
          {selectedSubCategory &&
            selectedSubCategory.subCategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sub-Subcategory
                </label>
                <select
                  value={selectedSubSubCategory?._id || ""}
                  onChange={handleSubSubCategoryChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a sub-subcategory</option>
                  {selectedSubCategory.subCategories.map((subSubCat) => (
                    <option key={subSubCat._id} value={subSubCat._id}>
                      {subSubCat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          <label> name</label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
          <label> descrition</label>
          <Input {...register("description")} />
          {errors.description && (
            <p className="text-xs text-red-600">{errors.description.message}</p>
          )}
          <label> price</label>
          <Input {...register("price")} type="number" />
          {errors.price && (
            <p className="text-xs text-red-600">{errors.price.message}</p>
          )}{" "}
          <label>discounted price</label>
          <Input {...register("discountedPrice")} type="number" />
          {errors.discountedPrice && (
            <p className="text-xs text-red-600">
              {errors.discountedPrice.message}
            </p>
          )}
          <label> stocks</label>
          <Input
            disabled={isVariable}
            className={`${isVariable && "disabled"}`}
            {...register("countInStock")}
            type="number"
          />
          {errors.countInStock && (
            <p className="text-xs text-red-600">
              {errors.countInStock.message}
            </p>
          )}
          <div className="m-4">
            {isVariable && (
              <div>
                {variants.map((variant, index) => (
                  <section
                    key={index}
                    className="mb-4 p-2 border rounded flex items-center gap-4"
                  >
                    <div className="flex flex-col w-full">
                      <label>Size</label>
                      <Input
                        placeholder="Enter size"
                        value={variant.size}
                        onChange={(e) =>
                          handleChange(index, "size", e.target.value)
                        }
                      />
                      <label>Color</label>
                      <Input
                        placeholder="Enter color"
                        value={variant.color}
                        onChange={(e) =>
                          handleChange(index, "color", e.target.value)
                        }
                      />
                      <label>Stock</label>
                      <Input
                        placeholder="Enter stock"
                        value={variant.stock}
                        onChange={(e) =>
                          handleChange(index, "stock", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveVariant(index)}
                    >
                      -
                    </Button>
                  </section>
                ))}
              </div>
            )}
            <Button onClick={handleAddVariant}>
              {isVariable ? "Add More Variants +" : "Add Variants (Optional)"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AllProducts;
