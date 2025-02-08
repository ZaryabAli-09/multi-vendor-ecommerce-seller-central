import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import {
  HiOutlineMenu,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { FcBullish } from "react-icons/fc";

const DASHBOARD_SIDEBAR_LINKS = [
  {
    label: "Overview",
    path: "/dashboard?tab=overview",
    icon: <HiOutlineViewGrid />,
  },
  { label: "Profile", path: "/dashboard?tab=profile", icon: <HiOutlineCube /> },
  {
    label: "Upload Product",
    path: "/dashboard?tab=upload-product",
    icon: <HiOutlineCube />,
  },
  {
    label: "Products",
    path: "/dashboard?tab=products",
    icon: <HiOutlineCube />,
  },
  {
    label: "Orders",
    path: "/dashboard?tab=orders",
    icon: <HiOutlineShoppingCart />,
  },
];

const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  { label: "Settings", path: "/settings", icon: <HiOutlineCog /> },

  { label: "Billing", path: "/dashboard?tab=billing", icon: <HiOutlineCog /> },

  {
    label: "Help & Support",
    path: "/support",
    icon: <HiOutlineQuestionMarkCircle />,
  },
];

const Sidebar = ({ activeTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Box className="w-60 bg-secondary text-primary-base h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <FcBullish fontSize={24} />
        <span className="font-bold text-sm">LOGO SELLER CENTRAL</span>
      </div>
      <List>
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              className={`rounded ${
                activeTab === link.path ? "bg-gray-300" : "hover:bg-primary"
              }`}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List className="mt-auto border-t pt-2">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              className={`rounded ${
                activeTab === link.path ? "bg-gray-300" : "hover:bg-primary"
              }`}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton className="text-red-500 hover:bg-primary rounded">
            <ListItemIcon>
              <HiOutlineLogout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-2 border">
        <IconButton onClick={toggleDrawer}>
          <HiOutlineMenu className="text-black" />
        </IconButton>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex border-r w-64 fixed overflow-y-auto bg-secondary h-full">
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
