import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import a loading spinner icon
import { Input } from "../components/common ui comps/Input";
import { Button } from "../components/common ui comps/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const resetPasswordToken = params.get("resetPasswordToken");
  const navigate = useNavigate();

  async function onSubmit(data) {
    setLoading(true); // Start loading
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/seller/auth/reset-password/${resetPasswordToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            newPassword: data.password,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setLoading(false);
        toast.error(result.message);
      } else {
        setLoading(false);
        toast.success(result.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }

  return (
    <div className="bg-primary flex justify-center items-center h-[100vh]">
      <form
        className="bg-secondary shadow-md rounded w-full sm:w-1/2 md:w-1/2 lg:w-1/3 px-8 pt-6 pb-8 mb-4 "
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl mb-4 ">Reset Password</h2>

        <div className="mb-4">
          <label className="font-bold text-xs">Password</label>

          <Input
            type="password"
            placeholder="Enter your new password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between flex-col space-y-2">
          <Button
            disabled={loading}
            type="submit"
            variant="primary"
            className="w-full"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="text-xl animate-spin mx-auto" />
            ) : (
              "Reset Your Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
