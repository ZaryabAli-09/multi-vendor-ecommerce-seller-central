import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiHome,
  FiLoader,
} from "react-icons/fi";

const SuccessPage = () => {
  const [order, setOrder] = useState(null);
  const [populatedOrderItems, setPopulatedOrderItems] = useState(null);

  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      toast.error("Invalid session ID");
      navigate("/payment-failure");
      return;
    }

    const confirmPayment = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/order/confirm-stripe-payment?session_id=${sessionId}`
        );

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setOrder(data?.data?.order);
        setPopulatedOrderItems(data?.data?.populatedOrderItems);
        toast.success(data.message);
      } catch (error) {
        toast.error(error.message);
        navigate("/payment-failure");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <FiLoader className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">
            Processing your payment
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we verify your transaction...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-green-50 rounded-t-lg p-6 border border-green-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="bg-green-100 p-3 rounded-full mb-4 md:mb-0 md:mr-6">
              <FiCheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Confirmed!
              </h1>
              <p className="text-green-700 mt-1">
                Thank you for your purchase. Your order #{order._id} has been
                received.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                A confirmation has been sent to your email.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-b-lg shadow-sm divide-y divide-gray-200 mt-4">
          {/* Order Details */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">
                  PKR {order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{order.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Items List */}
          {populatedOrderItems &&
            populatedOrderItems.map((item) => (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Items Ordered
                </h2>
                <ul className="divide-y divide-gray-200">
                  <li key={item._id} className="py-4 flex">
                    <div className="flex-shrink-0 h-20 w-20 rounded-md overflow-hidden">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <p className="text-base font-medium text-gray-900">
                          PKR {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            ))}
          {/* Shipping Info */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">
              Shipping Information
            </h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Shipping Address</p>
                <p className="mt-1">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                  <br />
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Details</p>
                <p className="mt-1">
                  Transaction ID: {order.paymentDetails.transactionId}
                  <br />
                  Status:{" "}
                  <span className="capitalize">
                    {order.paymentDetails.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition flex items-center justify-center"
            >
              <FiShoppingBag className="mr-2" /> View Orders
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center"
            >
              <FiHome className="mr-2" /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
