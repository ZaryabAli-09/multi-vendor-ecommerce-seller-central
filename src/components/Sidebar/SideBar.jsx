import React, { useState } from "react";
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
  Typography,
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
import { FcBullish } from "react-icons/fc";
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
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  console.log(activeTab);
  const sidebarContent = (
    <Box className="w-72 bg-stone-200 border-r border-stone-400 shadow-md text-black h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 ml-2 mb-8 pt-2 ">
        <div className="!font-extrabold text-xl text-stone-800">
          LOGO{" "}
          <span className="p-1 bg-stone-800 font-thin !text-lg text-white rounded  ">
            Seller Central
          </span>{" "}
        </div>
      </div>
      <List>
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding className="mb-1 ">
            <ListItemButton
              component={Link}
              to={link.path}
              className={` !rounded-lg ${
                activeTab === link.path
                  ? "!bg-stone-400 !text-white"
                  : "hover:!bg-stone-400"
              }`}
            >
              <ListItemIcon
                className={` !rounded-lg ${
                  activeTab === link.path
                    ? "!bg-stone-400 !text-white"
                    : "hover:!bg-stone-400"
                }`}
              >
                {link.icon}
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{ fontSize: "0.95rem" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List className="mt-auto border-t border-stone-400 pt-2">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <ListItem
            key={link.label}
            className={`mb-1 !rounded-lg ${
              activeTab === link.path
                ? "!bg-stone-400 !text-white"
                : "hover:!bg-stone-400"
            }`}
            disablePadding
          >
            <ListItemButton component={Link} to={link.path}>
              <ListItemIcon
                className={` !rounded-lg ${
                  activeTab === link.path
                    ? "!bg-stone-400 !text-white"
                    : "hover:!bg-stone-400"
                }`}
              >
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
            className="rounded-lg hover:bg-purple-600"
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
      <div className="md:hidden p-2 bg-stone-300">
        <IconButton onClick={toggleDrawer} className="text-white">
          <HiOutlineMenu size={24} />
        </IconButton>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex w-64 fixed overflow-y-auto h-full">
        {sidebarContent}
      </div>

      {/* Sidebar for Mobile */}
      <Drawer anchor={"left"} open={mobileOpen} onClose={toggleDrawer}>
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
