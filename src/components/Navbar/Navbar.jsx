import React, { useState } from "react";
import { AiOutlineLogout, AiOutlineMail } from "react-icons/ai";
import {
  Menu,
  MenuItem,
  CircularProgress,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducers";
import { HiOutlineMail } from "react-icons/hi";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, user } = useSelector((state) => state.auth);
  const userEmail = user?.email || "";
  const userLogo = user?.logo?.url;
  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center sticky top-0 z-50">
      {/* User Email */}

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <p className="font-semibold text-xs">Welcome, </p>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineMail className="text-gray-500" />
          <span>{userEmail || "Seller"}</span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="flex items-center  rounded-full border border-gray-300 ">
        {/* Profile Icon Button */}
        <IconButton
          onClick={handleMenuOpen}
          className="h-10 w-10 rounded-full bg-purple-700 hover:bg-purple-800 text-white"
          aria-controls="profile-menu"
          aria-haspopup="true"
        >
          {userLogo ? (
            <Avatar src={userLogo} className="h-8 w-8" />
          ) : (
            <span className="text-lg font-semibold">{userInitial}</span>
          )}
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-1"
          PaperProps={{
            className: "w-56 rounded-lg shadow-lg",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          {/* Profile Link */}
          <MenuItem
            onClick={() => {
              navigate("/dashboard?tab=profile");
              handleMenuClose();
            }}
            className="text-gray-700 hover:bg-gray-100 px-4 py-2"
          >
            Profile
          </MenuItem>

          {/* Logout Button */}
          <MenuItem
            onClick={handleLogout}
            className="text-gray-700 hover:bg-gray-100 px-4 py-2"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} className="mr-2" />
            ) : (
              <AiOutlineLogout className="mr-2" />
            )}
            Logout
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
