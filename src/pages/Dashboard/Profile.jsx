import React, { useEffect } from "react";
import { Input } from "../../components/common ui comps/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/common ui comps/Button";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

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
      .nullable(), // Optional field
    facebook: yup.string().url("Facebook link must be a valid URL").nullable(),
    twitter: yup.string().url("Twitter link must be a valid URL").nullable(),
    linkedin: yup.string().url("LinkedIn link must be a valid URL").nullable(),
  }),
});

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Allows setting form values programmatically
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitButton = async (data) => {
    try {
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
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchUserFromServer = async () => {
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

      console.log(result);
      if (!res.ok) {
        toast.error(result.message);
      } else {
        // Populate form inputs with fetched data
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
      try {
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchUserFromServer();
  }, [user._id]);

  return (
    <div className="">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmitButton)}>
        {/* brand logo
        <Input type="file" />
        brand cover photo
        <Input type="file" /> */}
        <label>Brand name</label>
        <Input {...register("brandName")} className="w-32" />
        {errors.brandName && (
          <p className="text-xs text-red-600">{errors.brandName.message}</p>
        )}
        <label>Brand description</label>
        <Input {...register("brandDescription")} className="w-32" />
        {errors.brandDescription && (
          <p className="text-xs text-red-600">
            {errors.brandDescription.message}
          </p>
        )}
        <label>Contact Number</label>
        <Input {...register("contactNumber")} className="w-32" />
        {errors.contactNumber && (
          <p className="text-xs text-red-600">{errors.contactNumber.message}</p>
        )}
        <label>businessAddress</label>
        <Input {...register("businessAddress")} className="w-32" />
        {errors.businessAddress && (
          <p className="text-xs text-red-600">
            {errors.businessAddress.message}
          </p>
        )}
        <h2>Social Linking</h2>
        <label>Instagram</label>
        <Input {...register("socialLinks.instagram")} className="w-32" />
        {errors.socialLinks?.instagram && (
          <p className="text-xs text-red-600">
            {errors.socialLinks.instagram.message}
          </p>
        )}

        <label>Facebook</label>
        <Input {...register("socialLinks.facebook")} className="w-32" />
        {errors.socialLinks?.facebook && (
          <p className="text-xs text-red-600">
            {errors.socialLinks.facebook.message}
          </p>
        )}

        <label>Twitter</label>
        <Input {...register("socialLinks.twitter")} className="w-32" />
        {errors.socialLinks?.twitter && (
          <p className="text-xs text-red-600">
            {errors.socialLinks.twitter.message}
          </p>
        )}

        <label>LinkedIn</label>
        <Input {...register("socialLinks.linkedin")} className="w-32" />
        {errors.socialLinks?.linkedin && (
          <p className="text-xs text-red-600">
            {errors.socialLinks.linkedin.message}
          </p>
        )}
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Profile;
