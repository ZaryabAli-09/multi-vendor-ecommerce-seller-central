import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
  Box,
  Dialog,
  CircularProgress,
  DialogTitle,
  DialogContent,
  Skeleton,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const schema = yup.object({
  bankDetails: yup.object().shape({
    bankName: yup.string().required("Bank name is required"),
    accountNumber: yup
      .string()
      .matches(/^\d+$/, "Account number must be digits only")
      .required("Account number is required"),
    accountHolderName: yup
      .string()
      .required("Account holder name is required")
      .min(2, "Account holder name must be at least 2 characters long"),
  }),
});

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col space-y-1 p-2">
    <p className="text-sm text-dark font-bold">{label}:</p>
    <p className="text-sm text-light">{value || "N/A"}</p>
  </div>
);

const Billing = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      bankDetails: {
        bankName: "",
        accountNumber: "",
        accountHolderName: "",
      },
    },
  });

  const [isFetching, setIsFetching] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitButton = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/update/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success(result.message);
      setLoading(false);
      setOpen(!open);
      fetchUserFromServer();
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const fetchUserFromServer = async () => {
    try {
      setIsFetching(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/single/${user._id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      if (result.data?.bankDetails) {
        setValue("bankDetails", result.data.bankDetails);
      }

      toast.success(result.message);
      setIsFetching(false);
    } catch (error) {
      toast.error(error.message);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (user?._id) fetchUserFromServer();
  }, [user._id]);

  return (
    <Box className="max-w-3xl mx-auto p-6 bg-secondary rounded-md shadow-md">
      <h2 className="text-xl md:text-2xl text-center mb-6 font-bold text-dark">
        Billing Information
      </h2>

      {isFetching ? (
        <div className="space-y-6">
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={100}
            className="rounded-md"
          />
        </div>
      ) : (
        <Box className="space-y-6 mt-5">
          <ProfileField
            label="Bank Name"
            value={watch("bankDetails.bankName")}
          />
          <ProfileField
            label="Account Number"
            value={watch("bankDetails.accountNumber")}
          />
          <ProfileField
            label="Account Holder Name"
            value={watch("bankDetails.accountHolderName")}
          />

          <div className="w-full flex justify-end">
            <Button
              className="font-semibold"
              size="small"
              onClick={() => setOpen(true)}
              variant="contained"
            >
              Edit
            </Button>
          </div>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Edit Billing Information
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmitButton)}>
            <TextField
              InputLabelProps={{ shrink: !!watch("bankDetails.bankName") }}
              {...register("bankDetails.bankName")}
              label="Bank Name"
              fullWidth
              margin="normal"
              error={!!errors.bankDetails?.bankName}
              helperText={errors.bankDetails?.bankName?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("bankDetails.accountNumber") }}
              {...register("bankDetails.accountNumber")}
              label="Account Number"
              fullWidth
              margin="normal"
              error={!!errors.bankDetails?.accountNumber}
              helperText={errors.bankDetails?.accountNumber?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{
                shrink: !!watch("bankDetails.accountHolderName"),
              }}
              {...register("bankDetails.accountHolderName")}
              label="Account Holder Name"
              fullWidth
              margin="normal"
              error={!!errors.bankDetails?.accountHolderName}
              helperText={errors.bankDetails?.accountHolderName?.message}
              className="mb-4"
            />

            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                size="small"
                color="error"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="small"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Billing;
