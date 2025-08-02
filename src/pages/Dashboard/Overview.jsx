import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
];
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

// Custom color palette
const cardColors = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Purple gradient
  "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", // Green gradient
  "linear-gradient(135deg, #ff7b25 0%, #ff6b6b 100%)", // Orange gradient
  "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)", // Blue gradient
  "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)", // Pink gradient
];
const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/seller/dashboard-information/${
            user._id
          }`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        toast.error(error.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  console.log(data);
  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  if (!data)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  const renderNoDataMessage = (message = "No data available") => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 300,
      }}
    >
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <h2 className="text-xl md:text-4xl mb-10"> Seller Dashboard Overview</h2>

      {/* Enhanced Top Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            title: "Total Revenue",
            value: `Rs. ${data.totalSellerSales.toLocaleString()}`,
            icon: <FaMoneyBillWave size={24} />,
            color: cardColors[0],
          },
          {
            title: "Avg Order Value",
            value: `Rs. ${data.avgOrderValue.toFixed(0)}`,
            icon: <FaChartLine size={24} />,
            color: cardColors[1],
          },
          {
            title: "Total Orders",
            value: data.totalSellerOrders,
            icon: <FaShoppingCart size={24} />,
            color: cardColors[2],
          },
          {
            title: "Total Products",
            value: data.totalSellerProduct,
            icon: <FaBoxOpen size={24} />,
            color: cardColors[3],
          },
          {
            title: "Total Customers",
            value: data.totalSellerCustomers,
            icon: <FaUsers size={24} />,
            color: cardColors[4],
          },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                background: card.color,
                color: "white",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "white",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 2,
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  {card.title}
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  textAlign: "right",
                }}
              >
                {card.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Enhanced Sales Overview (now bar chart) */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Monthly Sales
      </Typography>
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        {data.monthlySalesData.length === 0 ||
        data.monthlySalesData === undefined ||
        data.monthlySalesData === null ||
        !data.monthlySalesData ? (
          renderNoDataMessage("No sales data available!")
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={data.monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `Rs. ${value.toLocaleString()}`,
                  "Revenue",
                ]}
              />
              <Legend />
              <Bar
                dataKey="sales"
                name="Monthly Sales"
                fill="#178896"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Trend"
                stroke="#ff7300"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Top Selling Products (new horizontal bar chart) */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Top Selling Products
      </Typography>
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        {data.topSellingProducts.length === 0 ||
        data.topSellingProducts === undefined ||
        data.topSellingProducts === null ||
        !data.topSellingProducts ? (
          renderNoDataMessage("No top selling products available!")
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data.topSellingProducts}
              layout="vertical"
              margin={{ left: 100, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === "Sold"
                    ? [value, "Units Sold"]
                    : [`Rs. ${value}`, "Revenue"]
                }
              />
              <Bar
                dataKey="sold"
                name="Sold"
                fill="#22ca9d"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>

      {/* Category Insights (unchanged as requested) */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Category Insights
      </Typography>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Sales by Category
            </Typography>
            {data.productCategoryData.length === 0 ||
            data.productCategoryData === undefined ||
            data.productCategoryData === null ||
            !data.productCategoryData ? (
              renderNoDataMessage("No category sales data available!")
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.productCategoryData}
                    dataKey="quantity"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fontSize={9}
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.productCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} units`, "Quantity"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 2 }}>
              Product Distribution
            </Typography>
            {data.productDistributionData.length === 0 ||
            data.productDistributionData === undefined ||
            data.productDistributionData === null ||
            !data.productDistributionData ? (
              renderNoDataMessage("No product distribution data available!")
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.productDistributionData}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    fontSize={9}
                    outerRadius={80}
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.productDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} products`, "Count"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Reels Overview */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Reels Overview
      </Typography>

      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 2,
                background: cardColors[0],
                color: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle1">Total Reels</Typography>
              <Typography variant="h5" fontWeight="bold">
                {data.totalReels}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 2,
                background: cardColors[1],
                color: "white",
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Typography variant="subtitle1">Total Likes on Reels</Typography>
              <Typography variant="h5" fontWeight="bold">
                {data.totalReelLikes}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Reels with Chart and Preview */}
        <Box mt={4}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Top Reels by Likes
          </Typography>

          {data.topReels && data.topReels.length > 0 ? (
            <>
              {/* Bar Chart */}
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.topReels.map((reel) => ({
                    name: reel.productName,
                    likes: reel.likes,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="likes" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Reels Thumbnails in Flexbox */}
              <Box mt={4}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                  Preview Top Reels
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: 2,
                    pb: 1,
                    pr: 1,
                  }}
                >
                  {data.topReels.map((reel, index) => (
                    <Paper
                      key={index}
                      elevation={2}
                      sx={{
                        minWidth: 140,
                        p: 1,
                        borderRadius: 2,
                        background: "#f9f9f9",
                        flexShrink: 0,
                      }}
                    >
                      <video
                        src={reel.videoUrl}
                        width="120"
                        height="120"
                        controls
                        muted
                        style={{
                          borderRadius: 8,
                          objectFit: "cover",
                          marginBottom: 6,
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#333",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          mb: 0.5,
                        }}
                      >
                        {reel.productName.slice(0, 30) + "..." || "Untitled"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        👍 {reel.likes}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </>
          ) : (
            renderNoDataMessage("No top reels data available!")
          )}
        </Box>
      </Paper>

      {/* Enhanced Order Status */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Order Status
      </Typography>
      <Paper sx={{ p: 2, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        {data.orderStatusData.length === 0 ||
        data.orderStatusData === undefined ||
        data.orderStatusData === null ||
        !data.orderStatusData ? (
          renderNoDataMessage("No order status data available!")
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data?.orderStatusData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                label={{
                  value: "Order Count",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />
              <Tooltip
                formatter={(value) => [value, "Orders"]}
                contentStyle={{
                  borderRadius: 8,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  border: "none",
                }}
              />
              <Bar dataKey="count">
                {data?.orderStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#66bb6a", // Delivered - muted green
                        "#42a5f5", // Shipped - muted blue
                        "#ffb74d", // Pending - muted amber
                        "#ef5350", // Other - muted red
                      ][index % 4]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
};

export default SellerDashboard;
