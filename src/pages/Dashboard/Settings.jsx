import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { MdOutlineSettings } from "react-icons/md";
import { HiOutlineLockClosed } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true); // Show loader on save button

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/update/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      } else {
        toast.success("Password changed successfully.");
        setOpen(false);
        setLoading(false); // Show loader on save button
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false); // Show loader on save button
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <MdOutlineSettings className="text-3xl text-gray-800 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account credentials
        </p>
      </div>

      {/* Password Update Card */}
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full">
            <HiOutlineLockClosed className="text-green-600 text-xl" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Password</h3>
            <p className="text-sm text-gray-500">••••••••</p>
          </div>
        </div>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
        >
          Change
        </Button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-7 w-72"
          >
            <TextField
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" size="small">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            color="success"
            size="small"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
