import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const CategoryNavigation = () => {
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [mobileActiveSubcategory, setMobileActiveSubcategory] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/product/categories"
        );
        const data = await response.json();
        if (data.status === "success") {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Reset active states when closing menu
    if (mobileMenuOpen) {
      setActiveCategory(null);
      setMobileActiveSubcategory(null);
    }
  };

  const handleCategoryHover = (categoryId) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    const timeout = setTimeout(() => {
      setActiveCategory(categoryId);
    }, 100);
    setHoverTimeout(timeout);
  };

  const handleCategoryLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    setHoverTimeout(
      setTimeout(() => {
        setActiveCategory(null);
      }, 200)
    );
  };

  const handleMobileCategoryClick = (categoryId) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null);
      setMobileActiveSubcategory(null);
    } else {
      setActiveCategory(categoryId);
      setMobileActiveSubcategory(null);
    }
  };

  const handleMobileSubcategoryClick = (subcategoryId, e) => {
    e.stopPropagation(); // Prevent parent category click
    if (mobileActiveSubcategory === subcategoryId) {
      setMobileActiveSubcategory(null);
    } else {
      setMobileActiveSubcategory(subcategoryId);
    }
  };

  return (
    <nav className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center h-16 ">
          <div className="flex space-x-8 relative">
            {categories.map((category) => (
              <div
                key={category._id}
                className="relative"
                onMouseEnter={() => handleCategoryHover(category._id)}
                onMouseLeave={handleCategoryLeave}
              >
                <Link
                  to={`/products/${category.name}`}
                  className="text-gray-700 hover:text-red-500 flex items-center justify-between py-1"
                >
                  {category.name}
                </Link>

                {/* Mega Dropdown - Shows only for the hovered category */}
                {activeCategory === category._id && (
                  <div
                    className="absolute left-0 top-12 w-64 bg-white shadow-lg border border-gray-200 z-50"
                    onMouseEnter={() => clearTimeout(hoverTimeout)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 border-b pb-2">
                        {category.name}
                      </h3>
                      <ul className="space-y-2">
                        {category.subCategories.map((subCat) => (
                          <li key={subCat._id}>
                            <Link
                              to={`/products/${category.name}/${subCat.name}`}
                              className="text-gray-700 hover:text-red-500 flex items-center justify-between py-1"
                            >
                              <span>{subCat.name}</span>
                              {subCat.subCategories.length > 0 && (
                                <FiChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </Link>

                            {/* Show sub-subcategories by default without hover */}
                            {subCat.subCategories.length > 0 && (
                              <ul className="ml-4 mt-1 space-y-1">
                                {subCat.subCategories.map((subSubCat) => (
                                  <li key={subSubCat._id}>
                                    <Link
                                      to={`/products/${category.name}/${subCat.name}/${subSubCat.name}`}
                                      className="text-gray-500 hover:text-red-500 text-sm block py-1"
                                    >
                                      {subSubCat.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="">
              <input
                type="text"
                className="bg-slate-100 border rounded p-1 px-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="Search "
                onFocus={() => navigate("/products-search")}
              ></input>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center h-16">
          <button
            onClick={toggleMobileMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full z-50">
          <div className="px-4 py-2 space-y-1">
            {categories.map((category) => (
              <div key={category._id} className="border-b border-gray-100">
                <button
                  onClick={() => handleMobileCategoryClick(category._id)}
                  className="w-full flex justify-between items-center text-gray-800 hover:text-red-500 px-3 py-3 text-sm font-medium"
                >
                  <Link to={`/products/${category?.name}`}>
                    {category.name}
                  </Link>

                  <svg
                    className={`h-4 w-4 transform transition-transform ${
                      activeCategory === category._id ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {activeCategory === category._id && (
                  <div className="pl-4 pb-2">
                    {category.subCategories.map((subCategory) => (
                      <div
                        key={subCategory._id}
                        className="border-b border-gray-100"
                      >
                        <button
                          onClick={(e) =>
                            handleMobileSubcategoryClick(subCategory._id, e)
                          }
                          className="w-full flex justify-between items-center text-gray-700 hover:text-red-500 px-3 py-2 text-sm"
                        >
                          <Link
                            to={`/products/${category?.name}/${subCategory?.name}`}
                          >
                            {" "}
                            {subCategory.name}
                          </Link>

                          {subCategory.subCategories.length > 0 && (
                            <svg
                              className={`h-4 w-4 transform transition-transform ${
                                mobileActiveSubcategory === subCategory._id
                                  ? "rotate-90"
                                  : ""
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          )}
                        </button>

                        {mobileActiveSubcategory === subCategory._id &&
                          subCategory.subCategories.length > 0 && (
                            <div className="pl-4">
                              {subCategory.subCategories.map(
                                (subSubCategory) => (
                                  <a
                                    key={subSubCategory._id}
                                    href="#"
                                    className="block text-gray-600 hover:text-red-500 px-3 py-2 text-sm"
                                  >
                                    <Link
                                      to={`/products/${category?.name}/${subCategory?.name}/${subSubCategory?.name}`}
                                    >
                                      {subSubCategory.name}
                                    </Link>
                                  </a>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default CategoryNavigation;
