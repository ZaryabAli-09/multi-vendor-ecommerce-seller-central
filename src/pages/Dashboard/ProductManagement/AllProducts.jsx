import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ProductEditModal from "../../../components/Product/ProductEditModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllProducts = () => {
  const { user } = useSelector((state) => state.auth);

  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPopUp, setEditPopUp] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // For initial data fetch skeleton
  const [deletingProductId, setDeletingProductId] = useState(null); // For delete button loader

  const fetchProducts = async () => {
    try {
      setIsFetching(true); // Show skeleton while fetching data
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
    } finally {
      setIsFetching(false); // Hide skeleton after data is fetched
    }
  };

  const handleDelete = async (productId) => {
    try {
      setDeletingProductId(productId); // Show loader on delete button
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
        setProducts(products.filter((product) => product._id !== productId));
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingProductId(null); // Hide loader after API call
    }
  };

  const handleEdit = async (productId) => {
    setEditPopUp(true);
    setEditingProductId(productId);
  };

  useEffect(() => {
    fetchProducts();
  }, [user._id]);

  return (
    <>
      <div>
        <TableContainer className="p-4" component={Paper}>
          <h2 className="text-xl md:text-2xl mb-6">Manage your products</h2>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Sold</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isFetching ? (
                // Skeleton Loading
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={48} height={48} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={100} height={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : !products || products.length <= 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={product._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <img
                        src={product.variants?.[0].images[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <Link
                        to={`/dashboard/product/${product._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {product.name}
                      </Link>
                    </TableCell>
                    <TableCell>{product.countInStock}</TableCell>
                    <TableCell>
                      {product.categories.map((category) => (
                        <div key={category._id} className="text-xs">
                          {category.name}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>${product?.variants[0]?.price}</TableCell>
                    <TableCell>{product.sold}</TableCell>
                    <TableCell className="md:flex md:space-x-1 space-y-1 md:space-y-0">
                      <Button
                        onClick={() => handleEdit(product._id)}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        <FaEdit className="text-xl" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(product._id)}
                        variant="contained"
                        size="small"
                        color="error"
                        disabled={deletingProductId === product._id} // Disable button while deleting
                      >
                        {deletingProductId === product._id ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          <FaTrash className="text-xl" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Edit Product Modal */}
      <ProductEditModal
        editPopUp={editPopUp}
        setEditPopUp={setEditPopUp}
        fetchProducts={fetchProducts}
        editingProductId={editingProductId}
      />
    </>
  );
};

export default AllProducts;
