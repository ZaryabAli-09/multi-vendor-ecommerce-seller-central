// import React, { useEffect, useState } from "react";
// import { Input } from "../../../components/common ui comps/Input";
// import { toast } from "react-hot-toast";
// import { Button } from "../../../components/common ui comps/Button";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { useForm } from "react-hook-form";

// const schema = yup.object({
//   name: yup.string().required("Product name is required"),
//   description: yup.string().required("product description is required"),
//   price: yup
//     .number()
//     .transform((value, originalValue) =>
//       originalValue.trim() === "" ? null : value
//     )
//     .required("Product price is required")
//     .typeError("Product price must be a number"),
//   discountedPrice: yup
//     .number()
//     .transform((value, originalValue) =>
//       originalValue.trim() === "" ? null : value
//     )
//     .nullable(),
//   countInStock: yup
//     .number()
//     .transform((value, originalValue) =>
//       originalValue.trim() === "" ? 1 : value
//     )
//     .required("Please enter product stocks")
//     .typeError("Stocks must be a number"),
//   images: yup
//     .mixed()
//     .test("fileRequired", "Product image is required", (value) => {
//       return value && value.length > 0;
//     }),
// });

// const UploadProduct = () => {
//   // TODO: ui revamp , create dropdown for color and sizes ,code documentation , refactoring...

//   const [allCatgories, setAllCategories] = useState([]);
//   const [selectedMainCategory, setSelectedMainCategory] = useState(null);
//   const [selectedSubCategory, setSelectedSubCategory] = useState(null);
//   const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
//   const [isVariable, setIsVariable] = useState(false);
//   const [variants, setVariants] = useState([
//     { size: "", color: "", stock: "" },
//   ]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   // Handler for main category selection
//   const handleMainCategoryChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedCategory = allCatgories.find((cat) => cat._id === selectedId);
//     setSelectedMainCategory(selectedCategory);
//     setSelectedSubCategory(null); // Reset subcategory when main category changes
//     setSelectedSubSubCategory(null); // Reset sub-subcategory
//   };

//   // Handler for subcategory selection

//   const handleSubCategoryChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedSubCat = selectedMainCategory.subCategories.find(
//       (subCat) => subCat._id === selectedId
//     );
//     setSelectedSubCategory(selectedSubCat);
//     setSelectedSubSubCategory(null); // Reset sub-subcategory
//   };

//   // Handler for sub-subcategory selection
//   const handleSubSubCategoryChange = (e) => {
//     const selectedId = e.target.value;
//     const selectedSubSubCat = selectedSubCategory.subCategories.find(
//       (subSubCat) => subSubCat._id === selectedId
//     );
//     setSelectedSubSubCategory(selectedSubSubCat);
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/product/categories`
//       );

//       const result = await res.json();
//       if (!res.ok) {
//         throw new Error(result.message);
//       } else {
//         setAllCategories(result.data);

//         toast.success(result.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleProductCreation = async (productData) => {
//     try {
//       if (
//         !selectedMainCategory ||
//         !selectedSubCategory ||
//         !selectedSubSubCategory
//       ) {
//         toast.error("Product categories is required");
//         return;
//       }
//       productData.categories = [
//         selectedMainCategory?._id,
//         selectedSubCategory?._id,
//         selectedSubSubCategory?._id,
//       ];

//       const formData = new FormData();
//       formData.append("name", productData.name);
//       formData.append("description", productData.description);
//       formData.append("price", productData.price);
//       formData.append("countInStock", productData.countInStock);
//       formData.append("isVariable", isVariable);

//       formData.append("discountedPrice", productData.discountedPrice || null);
//       productData?.categories.forEach((category) => {
//         formData.append("categories", category);
//       });

//       Array.from(productData.images).forEach((image) => {
//         formData.append("images", image);
//       });
//       // Append each variant manually
//       variants.forEach((variant, index) => {
//         formData.append(`variants[${index}][size]`, variant.size);
//         formData.append(`variants[${index}][color]`, variant.color);
//         formData.append(`variants[${index}][stock]`, variant.stock);
//       });
//       if (isVariable) {
//         variants.forEach((variants, index) => {
//           if (
//             !variants.size ||
//             variants.size === "" ||
//             !variants.color ||
//             variants.color === "" ||
//             !variants.stock ||
//             variants.stock === ""
//           ) {
//             toast.error("Please enter variants otherwise remove it");
//             return;
//           }
//         });
//       }

//       console.log("FormData Entries:");
//       for (let pair of formData.entries()) {
//         console.log(pair[0], pair[1]); // Log FormData key-value pairs
//       }

//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/product/create`,
//         {
//           method: "POST",
//           credentials: "include",
//           body: formData,
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) {
//         throw new Error(result.message);
//       } else {
//         toast.success(result.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const handleAddVariant = () => {
//     if (!isVariable) {
//       setIsVariable(true);
//       setVariants([{ size: "", color: "", stock: "" }]);
//     } else {
//       setVariants([...variants, { size: "", color: "", stock: "" }]);
//     }
//   };

//   const handleRemoveVariant = (index) => {
//     const updatedVariants = variants.filter((_, i) => i !== index);
//     setVariants(updatedVariants);

//     if (updatedVariants.length === 0) {
//       setIsVariable(false);
//     }
//   };
//   const handleChange = (index, field, value) => {
//     const updatedVariants = [...variants];
//     updatedVariants[index][field] = value;
//     setVariants(updatedVariants);
//   };
//   return (
//     <div className=" w-72">
//       <form
//         onSubmit={handleSubmit(handleProductCreation)}
//         className="flex flex-col"
//       >
//         <div className="">
//           {/* Main Category Dropdown */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Main Category
//             </label>
//             <select
//               onChange={handleMainCategoryChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">Select a main category</option>
//               {allCatgories.map((category) => (
//                 <option key={category._id} value={category._id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Subcategory Dropdown (Conditional) */}
//           {selectedMainCategory &&
//             selectedMainCategory.subCategories.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Subcategory
//                 </label>
//                 <select
//                   onChange={handleSubCategoryChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select a subcategory</option>
//                   {selectedMainCategory.subCategories.map((subCat) => (
//                     <option key={subCat._id} value={subCat._id}>
//                       {subCat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//           {/* Sub-Subcategory Dropdown (Conditional) */}
//           {selectedSubCategory &&
//             selectedSubCategory.subCategories.length > 0 && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Sub-Subcategory
//                 </label>
//                 <select
//                   onChange={handleSubSubCategoryChange}
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select a sub-subcategory</option>
//                   {selectedSubCategory.subCategories.map((subSubCat) => (
//                     <option key={subSubCat._id} value={subSubCat._id}>
//                       {subSubCat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//         </div>
//         <label> name</label>
//         <Input {...register("name")} />
//         {errors.name && (
//           <p className="text-xs text-red-600">{errors.name.message}</p>
//         )}
//         <label> descrition</label>
//         <Input {...register("description")} />
//         {errors.description && (
//           <p className="text-xs text-red-600">{errors.description.message}</p>
//         )}
//         <label> price</label>
//         <Input {...register("price")} type="number" />
//         {errors.price && (
//           <p className="text-xs text-red-600">{errors.price.message}</p>
//         )}{" "}
//         <label>discounted price</label>
//         <Input {...register("discountedPrice")} type="number" />
//         {errors.discountedPrice && (
//           <p className="text-xs text-red-600">
//             {errors.discountedPrice.message}
//           </p>
//         )}
//         <label> stocks</label>
//         <Input
//           disabled={isVariable}
//           className={`${isVariable && "disabled"}`}
//           {...register("countInStock")}
//           type="number"
//         />
//         {errors.countInStock && (
//           <p className="text-xs text-red-600">{errors.countInStock.message}</p>
//         )}
//         <label> images</label>
//         <Input {...register("images")} type="file" multiple />
//         {errors.images && (
//           <p className="text-xs text-red-600">{errors.images.message}</p>
//         )}
//         <div className="m-4">
//           {isVariable && (
//             <div>
//               {variants.map((variant, index) => (
//                 <section
//                   key={index}
//                   className="mb-4 p-2 border rounded flex items-center gap-4"
//                 >
//                   <div className="flex flex-col w-full">
//                     <label>Size</label>
//                     <Input
//                       placeholder="Enter size"
//                       value={variant.size}
//                       onChange={(e) =>
//                         handleChange(index, "size", e.target.value)
//                       }
//                     />
//                     <label>Color</label>
//                     <Input
//                       placeholder="Enter color"
//                       value={variant.color}
//                       onChange={(e) =>
//                         handleChange(index, "color", e.target.value)
//                       }
//                     />
//                     <label>Stock</label>
//                     <Input
//                       placeholder="Enter stock"
//                       value={variant.stock}
//                       onChange={(e) =>
//                         handleChange(index, "stock", e.target.value)
//                       }
//                     />
//                   </div>
//                   <Button
//                     variant="danger"
//                     onClick={() => handleRemoveVariant(index)}
//                   >
//                     -
//                   </Button>
//                 </section>
//               ))}
//             </div>
//           )}
//           <Button onClick={handleAddVariant}>
//             {isVariable ? "Add More Variants +" : "Add Variants (Optional)"}
//           </Button>
//         </div>
//         <Button variant="primary" type="submit">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// };
// export default UploadProduct;
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  CircularProgress,
} from "@mui/material";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    variants: [{ size: "", color: "", price: "", stock: "", images: [] }],
  });
  const [allCatgories, setAllCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories from the backend
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

  // Handler for form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handler for category changes
  const handleCategoryChange = (e, level) => {
    const selectedId = e.target.value;
    let selectedCategory;
    if (level === "main") {
      selectedCategory = allCatgories.find((cat) => cat._id === selectedId);
      setSelectedMainCategory(selectedCategory);
      setSelectedSubCategory(null);
      setSelectedSubSubCategory(null);
    } else if (level === "sub") {
      selectedCategory = selectedMainCategory.subCategories.find(
        (subCat) => subCat._id === selectedId
      );
      setSelectedSubCategory(selectedCategory);
      setSelectedSubSubCategory(null);
    } else if (level === "subSub") {
      selectedCategory = selectedSubCategory.subCategories.find(
        (subSubCat) => subSubCat._id === selectedId
      );
      setSelectedSubSubCategory(selectedCategory);
    }
  };

  // Handler for adding/removing variants
  const handleAddVariant = () => {
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        { size: "", color: "", price: "", stock: "", images: [] },
      ],
    });
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Handler for variant input changes
  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index][name] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Handler for image changes in variants
  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedVariants = [...formData.variants];
    updatedVariants[index].images = files;
    setFormData({ ...formData, variants: updatedVariants });
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedMainCategory ||
      !selectedSubCategory ||
      !selectedSubSubCategory
    ) {
      toast.error("Product categories are required");
      return;
    }

    const categories = [
      selectedMainCategory?._id,
      selectedSubCategory?._id,
      selectedSubSubCategory?._id,
    ];

    if (formData?.variants.length === 0) {
      toast.error("At least Provide 1 variant for product information");
      return;
    }
    for (const variant of formData?.variants || []) {
      if (!variant.price) {
        toast.error("Please enter price for your product");
        return;
      } else if (!variant.stock || variant.stock <= 0) {
        toast.error("Please enter stock for your product");
        return;
      } else if (!variant.images || variant.images.length === 0) {
        toast.error(
          "Please select at least 1 image per variant for your product"
        );
        return;
      }
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("category", formData.category);
    categories.forEach((category) => {
      payload.append("categories", category);
    });

    formData.variants.forEach((variant, index) => {
      payload.append(`variants[${index}][size]`, variant.size);
      payload.append(`variants[${index}][color]`, variant.color);
      payload.append(`variants[${index}][price]`, variant.price);
      payload.append(`variants[${index}][stock]`, variant.stock);

      variant.images.forEach((image) => {
        payload.append(`variants[${index}][images]`, image);
      });
    });

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/create`,
        {
          method: "POST",
          credentials: "include",
          body: payload,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setLoading(false);
        throw new Error(result.message);
      } else {
        toast.success(result.message);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-3xl  font-semibold text-gray-800 p-4">
        Create Product
      </h2>

      <Box className="p-8 m-4 w-[90%]  mx-auto border bg-white shadow-lg rounded-md">
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <h2 className="my-2">Basic Information</h2>
          <div className="mb-4">
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          {/* Category Selection */}
          <div className="mb-4">
            <FormControl fullWidth>
              <InputLabel>Main Category</InputLabel>
              <Select
                value={selectedMainCategory?._id || ""}
                onChange={(e) => handleCategoryChange(e, "main")}
                label="Main Category"
                required
              >
                <MenuItem value="">Select Main Category</MenuItem>
                {allCatgories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {/* Subcategory Selection */}
          {selectedMainCategory &&
            selectedMainCategory.subCategories.length > 0 && (
              <div className="mb-4">
                <FormControl fullWidth>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={selectedSubCategory?._id || ""}
                    onChange={(e) => handleCategoryChange(e, "sub")}
                    label="Subcategory"
                    required
                  >
                    <MenuItem value="">Select Subcategory</MenuItem>
                    {selectedMainCategory.subCategories.map((subCat) => (
                      <MenuItem key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          {/* Sub-Subcategory Selection */}
          {selectedSubCategory &&
            selectedSubCategory.subCategories.length > 0 && (
              <div className="mb-4">
                <FormControl fullWidth>
                  <InputLabel>Sub-Subcategory</InputLabel>
                  <Select
                    value={selectedSubSubCategory?._id || ""}
                    onChange={(e) => handleCategoryChange(e, "subSub")}
                    label="Sub-Subcategory"
                    required
                  >
                    <MenuItem value="">Select Sub-Subcategory</MenuItem>
                    {selectedSubCategory.subCategories.map((subSubCat) => (
                      <MenuItem key={subSubCat._id} value={subSubCat._id}>
                        {subSubCat.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}{" "}
          {/* Product Description */}
          <div className="mb-4">
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={4}
            />
          </div>
          {/* Variants Section */}
          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-xl font-semibold mb-3">
                Variant {index + 1}
              </h3>

              <div className="mb-4">
                <TextField
                  label="Size"
                  variant="outlined"
                  fullWidth
                  name="size"
                  value={variant.size}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>

              <div className="mb-4">
                <TextField
                  label="Color"
                  variant="outlined"
                  fullWidth
                  name="color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>

              <div className="mb-4">
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>

              <div className="mb-4">
                <TextField
                  label="Stock"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                />
              </div>

              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageChange(index, e)}
                  className="border p-2 w-full"
                />
              </div>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveVariant(index)}
                className="mb-4"
              >
                Remove Variant
              </Button>
            </div>
          ))}
          {/* Add Variant Button */}
          <div className="mb-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddVariant}
            >
              Add Variant
            </Button>
          </div>
          {/* Submit Button */}
          <div className="mb-4">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </Box>
    </>
  );
};

export default CreateProduct;
