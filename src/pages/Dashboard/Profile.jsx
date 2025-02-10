import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

// Validation schema
const schema = yup.object({
  brandName: yup.string().required("Brand name is required"),
  brandDescription: yup
    .string()
    .min(10, "Description must be at least 10 characters"),
  contactNumber: yup
    .string()
    .matches(/^\d+$/, "Contact number must be digits only")
    .min(11, "Contact number must be 11 characters")
    .required("Contact number is required"),
  businessAddress: yup.string().required("Business Address is required"),
  socialLinks: yup.object({
    instagram: yup
      .string()
      .url("Instagram link must be a valid URL")
      .nullable(),
    facebook: yup.string().url("Facebook link must be a valid URL").nullable(),
    twitter: yup.string().url("Twitter link must be a valid URL").nullable(),
    linkedin: yup.string().url("LinkedIn link must be a valid URL").nullable(),
  }),
});

// Reusable Profile Field Component
const ProfileField = ({ label, value }) => (
  <div className="flex  flex-col space-x-1 space-y-1  p-2">
    <p className=" text-sm text-dark font-bold">{label}:</p>
    <p className="text-sm text-light">{value || "N/A"}</p>
  </div>
);

// Reusable Social Link Button Component
const SocialLinkButton = ({ icon, label, onClick }) => (
  <Button
    onClick={onClick}
    startIcon={icon}
    className="flex   hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 "
  >
    {/* {label} */}
  </Button>
);

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [brandInfo, setBrandInfo] = useState({});
  const [loading, setLoading] = useState(false); // For save button loader
  const [isFetching, setIsFetching] = useState(true); // For initial data fetch skeleton

  const [imgLoading, setImgLoading] = useState({ cover: false, logo: false });

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    if (brandInfo[type]?.public_id) {
      formData.append("oldPublicId", brandInfo[type].public_id);
    }

    try {
      setImgLoading((prev) => ({ ...prev, [type]: true }));

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/upload-${type}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include", // Using cookies for authentication
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to upload image");
      }

      toast.success(data.message);
      fetchBrandInfo();
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    } finally {
      setImgLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSocialLinkClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  const onSubmitButton = async (data) => {
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
        toast.success(result.message);
        setOpen(false);
        fetchBrandInfo();
        setLoading(false); // Show loader on save button
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false); // Show loader on save button
    }
  };

  const fetchBrandInfo = async () => {
    try {
      setIsFetching(true); // Show skeleton while fetching data
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/single/${user._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      } else {
        setIsFetching(false); // Hide skeleton after data is fetched

        setBrandInfo(result.data);
        setValue("brandName", result.data.brandName);
        setValue("brandDescription", result.data.brandDescription);
        setValue("contactNumber", result.data.contactNumber);
        setValue("businessAddress", result.data.businessAddress);
        setValue("socialLinks.instagram", result.data.socialLinks?.instagram);
        setValue("socialLinks.facebook", result.data.socialLinks?.facebook);
        setValue("socialLinks.twitter", result.data.socialLinks?.twitter);
        setValue("socialLinks.linkedin", result.data.socialLinks?.linkedin);
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
      setIsFetching(false); // Hide skeleton after data is fetched
    }
  };
  console.log(brandInfo);

  useEffect(() => {
    fetchBrandInfo();
  }, [user._id]);

  return (
    <Box className="max-w-3xl mx-auto p-6 bg-secondary rounded-md shadow-md">
      <h2 className="text-xl md:text-2xl text-center mb-6 font-bold text-dark">
        Profile Information
      </h2>

      {/* Skeleton Loading for Initial Data Fetch */}
      {isFetching ? (
        <div className="space-y-6">
          <Skeleton
            variant="rectangular"
            width="100%"
            height={200}
            className="rounded-md"
          />
          <Skeleton variant="text" width="60%" height={40} />
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
        <>
          <div className="relative">
            {/* Cover Image */}
            <div
              className="w-full h-48 bg-cover bg-center rounded-md cursor-pointer"
              style={{
                backgroundImage: `url(${
                  brandInfo?.coverImage?.url ||
                  "https://placehold.co/600x400/png"
                })`,
              }}
            >
              <input
                type="file"
                accept="image/*"
                hidden
                id="coverInput"
                onChange={(e) => handleImageUpload(e, "coverImage")}
              />
              <label htmlFor="coverInput" className="w-full h-full block" />
              {imgLoading.logo && (
                <CircularProgress className="absolute inset-0 m-auto" />
              )}
            </div>

            {/* Logo */}
            <div className="relative -bottom-20 left-1/2 transform -translate-x-1/2 w-40 h-40">
              {" "}
              <input
                type="file"
                accept="image/*"
                id="logoInput"
                onChange={(e) => handleImageUpload(e, "logo")}
              />
              <Avatar
                style={{ width: "100px", height: "100px" }}
                src={brandInfo?.logo?.url || "https://placehold.co/600x400/png"}
                className="w-full rounded-full h-full border-4 border-white cursor-pointer"
              >
                <label htmlFor="logoInput" className="w-full h-full block" />
                {imgLoading.logo && (
                  <CircularProgress className="absolute inset-0 m-auto" />
                )}
              </Avatar>
            </div>
          </div>

          <Box className="space-y-6 mt-5">
            {/* Display Brand Info */}
            <div className="space-y-4">
              <ProfileField label="Brand Name" value={brandInfo.brandName} />
              <ProfileField
                label="Contact Number"
                value={brandInfo.contactNumber}
              />
              <ProfileField
                label="Business Address"
                value={brandInfo.businessAddress}
              />
              <ProfileField
                label="Brand Description"
                value={brandInfo.brandDescription}
              />
            </div>

            {/* Social Media Links */}
            <div className="flex items-center justify-end border shadow-md p-2 rounded-md w-fit">
              <SocialLinkButton
                icon={<FaInstagram className="text-pink-600" />}
                label="Instagram"
                onClick={() =>
                  handleSocialLinkClick(brandInfo.socialLinks?.instagram)
                }
              />
              <SocialLinkButton
                icon={<FaFacebookF className="text-blue-600" />}
                label="Facebook"
                onClick={() =>
                  handleSocialLinkClick(brandInfo.socialLinks?.facebook)
                }
              />
              <SocialLinkButton
                icon={<FaTwitter className="text-blue-400" />}
                label="Twitter"
                onClick={() =>
                  handleSocialLinkClick(brandInfo.socialLinks?.twitter)
                }
              />
              <SocialLinkButton
                icon={<FaLinkedinIn className="text-blue-700" />}
                label="LinkedIn"
                onClick={() =>
                  handleSocialLinkClick(brandInfo.socialLinks?.linkedin)
                }
              />
            </div>

            {/* Edit Profile Button */}
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
        </>
      )}

      {/* Dialog Modal for Editing */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle className="text-xl font-bold text-gray-900">
          Edit Profile Information
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit(onSubmitButton)}>
            <TextField
              InputLabelProps={{ shrink: !!watch("brandName") }}
              {...register("brandName")}
              label="Brand Name"
              fullWidth
              margin="normal"
              error={!!errors.brandName}
              helperText={errors.brandName?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("contactNumber") }}
              {...register("contactNumber")}
              label="Contact Number"
              fullWidth
              margin="normal"
              error={!!errors.contactNumber}
              helperText={errors.contactNumber?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("brandDescription") }}
              {...register("brandDescription")}
              label="Brand Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.brandDescription}
              helperText={errors.brandDescription?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("businessAddress") }}
              {...register("businessAddress")}
              label="Business Address"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              error={!!errors.businessAddress}
              helperText={errors.businessAddress?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("socialLinks.instagram") }}
              {...register("socialLinks.instagram")}
              label="Instagram"
              fullWidth
              margin="normal"
              error={!!errors.socialLinks?.instagram}
              helperText={errors.socialLinks?.instagram?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("socialLinks.facebook") }}
              {...register("socialLinks.facebook")}
              label="Facebook"
              fullWidth
              margin="normal"
              error={!!errors.socialLinks?.facebook}
              helperText={errors.socialLinks?.facebook?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("socialLinks.twitter") }}
              {...register("socialLinks.twitter")}
              label="Twitter"
              fullWidth
              margin="normal"
              error={!!errors.socialLinks?.twitter}
              helperText={errors.socialLinks?.twitter?.message}
              className="mb-4"
            />
            <TextField
              InputLabelProps={{ shrink: !!watch("socialLinks.linkedin") }}
              {...register("socialLinks.linkedin")}
              label="LinkedIn"
              fullWidth
              margin="normal"
              error={!!errors.socialLinks?.linkedin}
              helperText={errors.socialLinks?.linkedin?.message}
              className="mb-4"
            />
            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
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
                className="font-semibold px-4 py-2 rounded-lg"
                disabled={loading} // Disable button while loading
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

export default Profile;
