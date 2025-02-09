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
    <Box className="max-w-3xl mx-auto p-6 bg-secondary rounded-md shadow-md">
      <h2 className="text-xl md:text-2xl text-center mb-6 font-bold text-dark">
        Account Settings{" "}
      </h2>

      <div className="flex items-center border space-x-1 border-gray-100 w-fit rounded-md p-4">
        <span className="text-3xl relative -top-2">......</span>
        <Button
          className="w-fit text-3xl"
          variant="text"
          color="warning"
          size="small"
          onClick={() => setOpen(true)}
        >
          Modify Password
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
    </Box>
  );
}
