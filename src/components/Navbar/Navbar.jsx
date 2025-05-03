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
    <nav className="border-b border-stone-400 w-full px-6 py-3 flex justify-between items-center ">
      {/* User Email */}

      <div className="flex items-center justify-center gap-2 bg-stone-600 p-1 rounded-lg">
        <p className="text-white font-semibold text-xs">Welcome</p>
        {/* <AiOutlineMail className="text-white" />{" "} */}
        <p variant="subtitle1" className="text-white font-semibold text-xs ">
          {userEmail}
        </p>
      </div>

      {/* Profile Section */}
      <div className="flex items-center">
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
