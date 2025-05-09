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
  Avatar,
  Typography,
  Divider,
} from "@mui/material";
import {
  FaCreditCard,
  FaUser,
  FaEdit,
  FaTimes,
  FaSave,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
} from "react-icons/fa";

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

const ProfileField = ({ label, value, icon }) => (
  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
    <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
      {icon}
    </Avatar>
    <div className="flex-1">
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" className="font-medium">
        {value || <span className="text-gray-400">Not provided</span>}
      </Typography>
    </div>
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
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      if (result.data?.bankDetails) {
        setValue("bankDetails", result.data.bankDetails);
      }

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
    <Box className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl md:text-2xl mb-6">
        Manage your Billing Information
      </h2>

      {isFetching ? (
        <div className="space-y-4">
          <Skeleton variant="rounded" width="100%" height={80} />
          <Skeleton variant="rounded" width="100%" height={80} />
          <Skeleton variant="rounded" width="100%" height={80} />
          <Skeleton
            variant="rounded"
            width={120}
            height={40}
            className="ml-auto"
          />
        </div>
      ) : (
        <Box className="space-y-4">
          <ProfileField
            label="Bank Name"
            value={watch("bankDetails.bankName")}
            icon={<FaMoneyCheckAlt />}
          />
          <ProfileField
            label="Account Number"
            value={watch("bankDetails.accountNumber")}
            icon={<FaCreditCard />}
          />
          <ProfileField
            label="Account Holder Name"
            value={watch("bankDetails.accountHolderName")}
            icon={<FaUser />}
          />

          <Divider sx={{ my: 2 }} />

          <Box className="flex justify-end">
            <Button
              startIcon={<FaEdit />}
              onClick={() => setOpen(true)}
              variant="contained"
              color="primary"
              size="medium"
            >
              Edit Information
            </Button>
          </Box>
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex items-center">
          <FaMoneyBillWave color="primary" style={{ marginRight: 8 }} />
          <Typography variant="h6" component="span" color="primary">
            Edit Billing Information
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmitButton)}
            sx={{ mt: 2 }}
          >
            <TextField
              InputLabelProps={{ shrink: !!watch("bankDetails.bankName") }}
              {...register("bankDetails.bankName")}
              label="Bank Name"
              fullWidth
              margin="normal"
              error={!!errors.bankDetails?.bankName}
              helperText={errors.bankDetails?.bankName?.message}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <FaMoneyCheckAlt
                    style={{ color: "action", marginRight: 8 }}
                  />
                ),
              }}
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("bankDetails.accountNumber") }}
              {...register("bankDetails.accountNumber")}
              label="Account Number"
              fullWidth
              margin="normal"
              error={!!errors.bankDetails?.accountNumber}
              helperText={errors.bankDetails?.accountNumber?.message}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <FaCreditCard style={{ color: "action", marginRight: 8 }} />
                ),
              }}
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
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <FaUser style={{ color: "action", marginRight: 8 }} />
                ),
              }}
            />

            <DialogActions sx={{ px: 0 }}>
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                size="medium"
                color="error"
                startIcon={<FaTimes />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="medium"
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <FaSave />
                }
              >
                Save Changes
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Billing;
