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
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import OrderDetailsModal from "../../components/Order/OrderDetailsModal ";
import { FaEye } from "react-icons/fa";

const Orders = () => {
  const { user } = useSelector((state) => state.auth); // Logged-in user (seller)

  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // For initial data fetch skeleton
  const [updatingStatus, setUpdatingStatus] = useState(false); // For status update loader

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setIsFetching(true); // Show skeleton while fetching data
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/order/seller-orders`,
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
        setOrders(result.data);
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false); // Hide skeleton after data is fetched
    }
  };

  // Handle status change for a sub-order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true); // Show loader on status change
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/order/update-status/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      } else {
        // Update the status in the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) => ({
            ...order,
            subOrders: order.subOrders.map((subOrder) =>
              subOrder._id === orderId
                ? { ...subOrder, status: newStatus }
                : subOrder
            ),
          }))
        );
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false); // Hide loader after API call
    }
  };

  // Handle viewing order details
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setDetailsModalOpen(true);
  };

  useEffect(() => {
    fetchOrders();
  }, [user._id]);

  // Filter sub-orders to include only the seller's sub-orders
  const sellerSubOrders = orders.flatMap((order) =>
    order.subOrders
      .filter((subOrder) => subOrder.seller === user._id)
      .map((subOrder) => ({
        ...subOrder,
        orderId: order._id, // Include the parent order ID
        orderBy: order.orderBy, // Include the customer details
      }))
  );

  return (
    <>
      <div>
        <TableContainer className="p-4" component={Paper}>
          <h2 className="text-xl md:text-2xl mb-6">Manage your orders</h2>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Customer Email</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
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
              ) : sellerSubOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                sellerSubOrders.map((subOrder, index) => (
                  <TableRow key={subOrder._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{subOrder.orderId}</TableCell>{" "}
                    {/* Parent Order ID */}
                    <TableCell>{subOrder.orderBy?.name}</TableCell>{" "}
                    {/* Customer Name */}
                    <TableCell>{subOrder.orderBy?.email}</TableCell>{" "}
                    {/* Customer Email */}
                    <TableCell>${subOrder.totalAmount}</TableCell>{" "}
                    {/* Sub-Order Total */}
                    <TableCell>
                      <Select
                        value={subOrder.status}
                        onChange={(e) =>
                          handleStatusChange(subOrder.orderId, e.target.value)
                        }
                        disabled={updatingStatus}
                        size="small"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="canceled">Canceled</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleViewDetails(subOrder.orderId)} // Use parent order ID
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        <FaEye className="text-xl" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default Orders;
