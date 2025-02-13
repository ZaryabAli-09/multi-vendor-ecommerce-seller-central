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

// Predefined color options (Ensure these match your DB)
const colorOptions = [
  { name: "Red", value: "#FF0000" },
  { name: "Blue", value: "#0000FF" },
  { name: "Green", value: "#008000" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
];

// Size options for different categories
const clothingSizes = ["S", "M", "L", "XL", "XXL"];
const shoeSizes = ["6", "7", "8", "9", "10", "11"]; // Common shoe sizes

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

  // Add these new states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [colorImageMap, setColorImageMap] = useState({});

  // Replace handleAddVariant/handleRemoveVariant with this
  useEffect(() => {
    // Generate variants when colors/sizes change
    const newVariants = selectedColors.flatMap((color) =>
      selectedSizes.map((size) => ({
        size,
        color,
        price: "",
        stock: "",
        discountedPrice: "",
        images: colorImageMap[color] || [],
      }))
    );

    setFormData((prev) => ({
      ...prev,
      variants: newVariants,
    }));
  }, [selectedColors, selectedSizes, colorImageMap]);

  // New handler for color images
  const handleColorImageUpload = (color, files) => {
    setColorImageMap((prev) => ({
      ...prev,
      [color]: [...(prev[color] || []), ...files],
    }));
  };

  const isFootwear = selectedSubCategory?.name?.toLowerCase() === "footwear";
  const availableSizes = isFootwear ? shoeSizes : clothingSizes;

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
    // Validate color images
    const missingImages = selectedColors.some(
      (color) => !colorImageMap[color]?.length
    );
    if (missingImages) {
      toast.error("Please upload images for all selected colors");
      return;
    }
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
    let hasImages = false;
    const colorMap = new Map(); // Stores whether a color has images assigned

    for (let i = 0; i < (formData?.variants || []).length; i++) {
      const variant = formData.variants[i];

      if (!variant.price) {
        toast.error("Please enter price for your product");
        return;
      }

      if (!variant.stock || variant.stock <= 0) {
        toast.error("Please enter stock for your product");
        return;
      }

      // If the variant has a color
      if (variant.color) {
        if (!colorMap.has(variant.color)) {
          // First time encountering this color
          if (!variant.images || variant.images.length === 0) {
            toast.error(
              `Please select at least 1 image for the color variant: ${variant.color}`
            );
            return;
          }
          colorMap.set(variant.color, true); // Mark this color as having images
        } else {
          // If this color was encountered before, images can be skipped
        }
      }

      // Check if any variant has images
      if (variant.images && variant.images.length > 0) {
        hasImages = true;
      }
    }

    // If no variants have images at all, throw an error
    if (!hasImages) {
      toast.error("At least one variant must have images for the product");
      return;
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
      payload.append(
        `variants[${index}][discountedPrice]`,
        variant.discountedPrice
      );

      variant.images.forEach((image) => {
        payload.append(`variants[${index}][images]`, image);
      });
    });

    for (let pair of payload.entries()) {
      console.log(pair[0], pair[1]);
    }

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
      <Box className="p-8 m-4 w-[90%]  mx-auto border bg-white shadow-lg rounded-md">
        <h2 className=" text-xl md:text-2xl  mb-4 text-dark">Upload Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <p className="my-2 font-bold">Basic Information</p>
          <div className="flex items-center justify-end"></div>
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

          <div className="flex flex-col-reverse md:flex-row md:justify-between ">
            <div className="md:w-[50%]">
              <div className="mb-4 ">
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
            </div>
            <div className="p-4 shadow-md rounded-lg border h-32 my-2 mb-4 md:w-[40%]  bg-purple-500 text-secondary  ">
              <h3 className="font-bold">* {""}Tips</h3>
              <p className="text-xs">
                Please make sure to upload product images(s), fill product name,
                and select the correct category to publish a product.
              </p>
            </div>
          </div>
          {/* Product Description */}
          <div className="mb-4">
            <div className="p-4 shadow-md rounded-lg border my-2 mb-4   bg-purple-500 text-secondary  ">
              <h3 className="font-bold">* {""}Tips</h3>
              <p className=" text-[9px] md:text-xs">
                When uploading accessories like jewelry and watches, provide a
                detailed description including material (gold-plated, stainless
                steel, leather, etc.), dimensions (chain length, dial size,
                strap width), weight, and any special features like water
                resistance, adjustable sizing, or gemstone details in
                description.
              </p>
            </div>
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
          <div className="p-4 shadow-md rounded-lg border  my-2 mb-4   bg-purple-500 text-secondary ">
            <h3 className="font-bold">* {""}Tips</h3>
            <p className="text-[9px] md:text-xs">
              For variant-based products like shoes and clothing, ensure that
              each product has at least one variant with details like size,
              color, price, and stock availability. If a product comes in the
              same color but different sizes, upload images only in one variant
              to avoid duplication. However, if you have different images for
              each size, you can upload them separately for better clarity.
              Always mention fabric type, fit, stretchability, and washing
              instructions in the description. Providing a size chart and clear
              images from multiple angles will help customers make informed
              decisions.
            </p>
          </div>

          {/* variants selection  */}
          {selectedSubSubCategory && (
            <>
              <div className="mb-4 bg-orange-200 p-4 rounded-md">
                <div className="flex flex-col gap-3 mb-4">
                  <p className="font-bold">
                    {" "}
                    <span className="text-orange-600">*</span> Variant 1{" "}
                  </p>
                  <p className="text-sm">Variant Name</p>
                  <p className="text-sm">Color Family</p>
                </div>
                <FormControl fullWidth>
                  <InputLabel>Select Colors</InputLabel>
                  <Select
                    multiple
                    label="Select Colors"
                    value={selectedColors}
                    onChange={(e) => setSelectedColors(e.target.value)}
                    renderValue={(selected) => (
                      <div className="flex flex-wrap gap-1">
                        {selected.map((color) => (
                          <div key={color} className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-1"
                              style={{ backgroundColor: color }}
                            />
                            {colorOptions.find((c) => c.value === color)?.name}
                          </div>
                        ))}
                      </div>
                    )}
                  >
                    {colorOptions.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded-full mr-2 border"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              {/* Color Image Uploads */}
              {selectedColors.map((color) => (
                <div key={color} className="mb-4">
                  <InputLabel>
                    <span className="text-orange-600 font-bold text-xl">*</span>{" "}
                    Upload Images for{" "}
                    {colorOptions.find((c) => c.value === color)?.name} variant
                  </InputLabel>
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      handleColorImageUpload(color, Array.from(e.target.files))
                    }
                    className="border p-2 w-full rounded"
                    accept="image/*"
                  />
                </div>
              ))}
              <div className="mb-4 bg-orange-200 p-4 rounded-md">
                <div className="flex flex-col gap-3 mb-4">
                  <p className="font-bold">
                    {" "}
                    <span className="text-orange-600">*</span> Variant 2{" "}
                  </p>
                  <p className="text-sm">Variant Name</p>
                  <p className="text-sm">Size</p>
                </div>
                <FormControl fullWidth>
                  <InputLabel>Select Sizes</InputLabel>
                  <Select
                    label="Sizes"
                    multiple
                    value={selectedSizes}
                    onChange={(e) => setSelectedSizes(e.target.value)}
                  >
                    {availableSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </>
          )}

          {/* Modified Variants Display */}
          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-6 border p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <TextField
                  label="Size"
                  value={variant.size}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Color"
                  value={
                    colorOptions.find((c) => c.value === variant.color)?.name
                  }
                  disabled
                  fullWidth
                />
              </div>

              {/* Rest of variant fields remain same */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="Price"
                  name="price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  fullWidth
                  required
                />
                <TextField
                  label="Discounted Price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="discountedPrice"
                  value={variant.discountedPrice}
                  onChange={(e) => handleVariantChange(index, e)}
                />
                <TextField
                  label="Stock"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="stock"
                  value={variant.stock}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
                />{" "}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="mb-4">
            <Button
              variant="contained"
              color="secondary"
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
