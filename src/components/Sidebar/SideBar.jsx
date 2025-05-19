import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUpload,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineStar,
  HiOutlineChat,
  HiOutlineCog,
  HiOutlineCreditCard,
  HiOutlineSupport,
  HiOutlineLogout,
  HiOutlineMenu,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducers";

const DASHBOARD_SIDEBAR_LINKS = [
  {
    label: "Store Insights",
    path: "/dashboard?tab=overview",
    icon: <HiOutlineHome size={20} />,
  },
  {
    label: "Profile",
    path: "/dashboard?tab=profile",
    icon: <HiOutlineUser size={20} />,
  },
  {
    label: "Upload Product",
    path: "/dashboard?tab=upload-product",
    icon: <HiOutlineUpload size={20} />,
  },
  {
    label: "Products",
    path: "/dashboard?tab=products",
    icon: <HiOutlineShoppingBag size={20} />,
  },
  {
    label: "Orders",
    path: "/dashboard?tab=orders",
    icon: <HiOutlineShoppingCart size={20} />,
  },
  {
    label: "Reviews",
    path: "/dashboard?tab=reviews",
    icon: <HiOutlineStar size={20} />,
  },
];

const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    label: "Messages",
    path: "/dashboard?tab=chat",
    icon: <HiOutlineChat size={20} />,
  },
  {
    label: "Settings",
    path: "/dashboard?tab=settings",
    icon: <HiOutlineCog size={20} />,
  },
  {
    label: "Billing",
    path: "/dashboard?tab=billing",
    icon: <HiOutlineCreditCard size={20} />,
  },
  {
    label: "Support",
    path: "/dashboard?tab=support",
    icon: <HiOutlineSupport size={20} />,
  },
];

const Sidebar = ({ activeTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleTheme = () => setDarkMode(!darkMode);

  const sidebarLinkStyle = (path) =>
    `!rounded-lg ${
      activeTab === path
        ? "!bg-blue-600 !text-white"
        : "hover:!bg-blue-100 text-black dark:text-white"
    }`;

  const sidebarIconStyle = (path) =>
    `${activeTab === path ? "!text-white" : "text-black dark:text-white"}`;

  const sidebarContent = (
    <Box
      className={`w-72 h-full flex flex-col border-r shadow-md p-4 ${
        darkMode ? "bg-gray-900 text-white" : "bg-stone-50 text-black"
      }`}
    >
      {/* App Branding */}
      <div className="flex items-center gap-2 mb-8 p-2">
        <HiOutlineShoppingBag className="text-2xl" />
        <span className="font-bold text-lg">
          {import.meta.env.VITE_PLATFORM_NAME}
        </span>
        <span className="text-xs bg-black text-white px-2 py-1 rounded ml-auto">
          SELLER
        </span>
      </div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-medium">Connected</span>
        </div>
      </div>

      {/* Top Links */}
      <List>
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding className="mb-1">
            <ListItemButton
              component={Link}
              to={link.path}
              className={sidebarLinkStyle(link.path)}
            >
              <ListItemIcon className={sidebarIconStyle(link.path)}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Links */}
      <List className="mt-auto border-t border-stone-400 pt-2">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding className="mb-1">
            <ListItemButton
              component={Link}
              to={link.path}
              className={sidebarLinkStyle(link.path)}
            >
              <ListItemIcon className={sidebarIconStyle(link.path)}>
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontSize: "0.95rem" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding className="mb-1">
          <ListItemButton
            onClick={handleLogout}
            className="rounded-lg hover:bg-blue-600 text-white"
          >
            <ListItemIcon className="text-white">
              <HiOutlineLogout size={20} />
            </ListItemIcon>
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: "0.95rem" }}
              />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div
        className={`md:hidden p-2 ${darkMode ? "bg-gray-900" : "bg-stone-50"}`}
      >
        <IconButton onClick={toggleDrawer} className="text-white">
          <HiOutlineMenu size={24} />
        </IconButton>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 fixed overflow-y-auto h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <Drawer anchor={"left"} open={mobileOpen} onClose={toggleDrawer}>
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
