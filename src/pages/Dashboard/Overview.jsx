import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/seller/dashboard-information/674a1d35b7c4360c86e36baa`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Seller Dashboard
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {[
          {
            title: "Total Revenue",
            value: `$${data.totalSellerSales}`,
            color: "#0088FE",
          },
          {
            title: "Average Order Value",
            value: `$${(data.totalSellerSales / data.totalSellerOrders).toFixed(
              2
            )}`,
            color: "#00C49F",
          },
          {
            title: "Total Orders",
            value: data.totalSellerOrders,
            color: "#FFBB28",
          },
          {
            title: "Total Products",
            value: data.totalSellerProduct,
            color: "#FF8042",
          },
          {
            title: "Total Customers",
            value: data.totalSellerCustomers,
            color: "#AF19FF",
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              sx={{
                padding: 3,
                textAlign: "center",
                backgroundColor: metric.color,
                color: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                height: "100%", // Ensure all cards have the same height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {metric.title}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sales Overview */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Sales Overview
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Product Performance */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Top Selling Products
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.productDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Customer Insights */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Product Category Demographics
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.productCategoryDataArray}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.productCategoryDataArray.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Paper>

      {/* Order Status */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Order Status
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.orderStatusDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default SellerDashboard;
