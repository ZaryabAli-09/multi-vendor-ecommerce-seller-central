import React, { useState } from "react";
import { AiFillProfile, AiOutlineLogout } from "react-icons/ai";
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  IconButton,
  Avatar,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success(result.message);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
      handleMenuClose();
    }
  };

  return (
    <nav className="bg-white border-b px-4 py-2 flex justify-end items-center">
      <div>
        {/* Profile Icon Button */}
        <IconButton
          onClick={handleMenuOpen}
          className="h-10 w-10 rounded-full"
          aria-controls="profile-menu"
          aria-haspopup="true"
        >
          <Avatar className="text-2xl " />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-2"
          PaperProps={{
            className: "w-48 rounded-lg shadow-lg",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          TransitionProps={{
            timeout: 150,
            enter: true,
            exit: true,
          }}
        >
          {/* Profile Link */}
          <MenuItem
            onClick={() => {
              navigate("/dashboard?tab=profile");
              handleMenuClose();
            }}
            className="text-gray-700 hover:bg-gray-100"
          >
            Profile
          </MenuItem>

          {/* Logout Button */}
          <MenuItem
            onClick={handleLogout}
            className="text-gray-700 hover:bg-gray-100"
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
