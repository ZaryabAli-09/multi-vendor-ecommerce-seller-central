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
          {/* Variants Section */}
          {formData.variants.map((variant, index) => (
            <div key={index} className="mb-6 border p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <p className=" font-bold">Variant {index + 1}</p>
              </div>

              {/* Size and Color Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Size Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Size</InputLabel>
                  <Select
                    label="Size"
                    name="size"
                    value={variant.size}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                  >
                    {availableSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Color Dropdown */}
                <FormControl fullWidth>
                  <InputLabel>Color</InputLabel>
                  <Select
                    label="Color"
                    name="color"
                    value={variant.color}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                    renderValue={(selected) => (
                      <div className="flex items-center">
                        <div
                          className="w-6 h-6 rounded-full mr-2 border"
                          style={{ backgroundColor: selected }}
                        ></div>
                        {colorOptions.find((c) => c.value === selected)?.name ||
                          selected}
                      </div>
                    )}
                  >
                    {colorOptions.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <div className="flex items-center">
                          <div
                            className="w-6 h-6 rounded-full mr-2 border"
                            style={{ backgroundColor: color.value }}
                          ></div>
                          {color.name}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <TextField
                  label="Price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  name="price"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, e)}
                  required
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
                />
              </div>

              {/* Image Upload */}
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleImageChange(index, e)}
                  className="border p-2 w-full rounded"
                  accept="image/*"
                />
              </div>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveVariant(index)}
                fullWidth
                size="small"
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
