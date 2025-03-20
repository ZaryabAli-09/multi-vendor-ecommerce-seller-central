import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Grid,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";

const DummyOrder = ({ buyerId = "6769bf283ce5c7b6ff4b72c9" }) => {
  const [products, setProducts] = useState([]); // All products fetched from the backend
  const [cart, setCart] = useState([]); // Products added to the cart
  const [selectedSeller, setSelectedSeller] = useState(null); // Selected seller for checkout
  const [loading, setLoading] = useState(true); // Loading state for fetching products

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/product/all`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add a product variant to the cart
  const addToCart = (product, variant, quantity) => {
    const existingItem = cart.find(
      (item) =>
        item.product._id === product._id && item.variant._id === variant._id
    );

    if (existingItem) {
      // Update quantity if the item already exists in the cart
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product._id === product._id && item.variant._id === variant._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      // Add new item to the cart
      setCart((prevCart) => [
        ...prevCart,
        {
          product,
          variant,
          quantity,
          seller: product.seller,
        },
      ]);
    }
  };

  // Remove a product variant from the cart
  const removeFromCart = (productId, variantId) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.product._id === productId && item.variant._id === variantId)
      )
    );
  };

  // Update quantity of a product variant in the cart
  const updateQuantity = (productId, variantId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product._id === productId && item.variant._id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Group cart items by seller
  const cartBySeller = cart.reduce((acc, item) => {
    const sellerId = item.seller._id;
    if (!acc[sellerId]) {
      acc[sellerId] = {
        seller: item.seller,
        items: [],
      };
    }
    acc[sellerId].items.push(item);
    return acc;
  }, {});

  // Calculate total amount for the selected seller
  const totalAmount = selectedSeller
    ? cartBySeller[selectedSeller].items.reduce(
        (total, item) =>
          total +
          (item.variant.discountedPrice || item.variant.price) * item.quantity,
        0
      )
    : 0;

  // Handle order creation
  const handleOrderNow = async () => {
    if (!selectedSeller) {
      alert("Please select a seller to proceed with the order.");
      return;
    }

    const orderItems = cartBySeller[selectedSeller].items.map((item) => ({
      product: item.product._id,
      variantId: item.variant._id,
      quantity: item.quantity,
    }));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/order/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            buyerId,
            orderItems,
            totalAmount,
            paymentMethod: "cash on delivery", // Default payment method for testing
            shippingAddress: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              postalCode: "10001",
              country: "USA",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      alert("Order created successfully!");
      console.log("Order created:", data);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  if (loading) {
    return <Typography>Loading products...</Typography>;
  }

  return (
    <Box p={4}>
      {/* Product List */}
      <Typography variant="h4" gutterBottom>
        All Products
      </Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{product.name}</Typography>
              {product.variants.map((variant) => (
                <Box key={variant._id} sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={variant.images[0]?.url}
                      alt={variant.color}
                      sx={{ width: 50, height: 50 }}
                    />
                    <Typography>
                      Size: {variant.size}, Color: {variant.color}, Price: $
                      {variant.discountedPrice || variant.price}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TextField
                      type="number"
                      label="Quantity"
                      defaultValue={1}
                      inputProps={{ min: 1 }}
                      size="small"
                      sx={{ width: 80, mr: 2 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => addToCart(product, variant, 1)}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Cart Section */}
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        Cart
      </Typography>
      {Object.keys(cartBySeller).map((sellerId) => (
        <Paper key={sellerId} elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControlLabel
              value={sellerId}
              control={<Radio />}
              label={
                <Typography variant="h6">
                  Seller: {cartBySeller[sellerId].seller.brandName}
                </Typography>
              }
              checked={selectedSeller === sellerId}
              onChange={() => setSelectedSeller(sellerId)}
            />
          </Box>
          <List>
            {cartBySeller[sellerId].items.map((item) => (
              <ListItem key={`${item.product._id}-${item.variant._id}`}>
                <ListItemAvatar>
                  <Avatar
                    src={item.variant.images[0]?.url}
                    alt={item.variant.color}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.product.name} - ${item.variant.size}, ${item.variant.color}`}
                  secondary={`$${
                    item.variant.discountedPrice || item.variant.price
                  } x ${item.quantity}`}
                />
                <TextField
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(
                      item.product._id,
                      item.variant._id,
                      parseInt(e.target.value)
                    )
                  }
                  size="small"
                  sx={{ width: 80, mr: 2 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    removeFromCart(item.product._id, item.variant._id)
                  }
                >
                  Remove
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}

      {/* Order Summary */}
      {selectedSeller && (
        <Paper elevation={3} sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6">Order Summary</Typography>
          <List>
            {cartBySeller[selectedSeller].items.map((item) => (
              <ListItem key={`${item.product._id}-${item.variant._id}`}>
                <ListItemAvatar>
                  <Avatar
                    src={item.variant.images[0]?.url}
                    alt={item.variant.color}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.product.name} - ${item.variant.size}, ${item.variant.color}`}
                  secondary={`$${
                    item.variant.discountedPrice || item.variant.price
                  } x ${item.quantity}`}
                />
              </ListItem>
            ))}
          </List>
          <Typography sx={{ mt: 2 }}>
            Total Amount: ${totalAmount.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrderNow}
            sx={{ mt: 2 }}
          >
            Order Now
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default DummyOrder;
