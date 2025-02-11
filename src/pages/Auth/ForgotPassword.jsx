import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import a loading spinner icon
import { Input } from "../../components/common ui comps/Input";
import { Button } from "../../components/common ui comps/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false); // Local loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleForgotPassword(data) {
    setLoading(true); // Set loading to true before making the API call
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
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
    <section className="bg-primary flex justify-center items-center h-[100vh]">
      <form
        className="bg-secondary shadow-md rounded w-full sm:w-1/2 md:w-1/2 lg:w-1/3 px-8 pt-6 pb-8 mb-4 "
        onSubmit={handleSubmit(handleForgotPassword)}
      >
        <h2 className="text-2xl mb-4">Forgot Password</h2>

        <div className="mb-4">
          <label className="font-bold text-xs">Email</label>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")} // React Hook Form binding
          />
          {errors.email && (
            <p className="text-red-500 text-xs  mt-1">{errors.email.message}</p>
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
              "Send Email"
            )}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ForgotPassword;
