import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai"; // Import a loading spinner icon
import { AiFillAlipayCircle } from "react-icons/ai";
import { Input } from "../../components/common ui comps/Input";
import { Button } from "../../components/common ui comps/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSeller } from "../../store/authReducers";

// form validation as yup
const schema = yup.object({
  brandName: yup.string().required("Brand name is required"),
  brandDescription: yup
    .string()
    .min(10, "Description must be at least 10 characters"),
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required"),
  contactNumber: yup
    .string()
    .matches(/^\d+$/, "Contact number must be digits only")
    .min(11, "Contact number must be 11 characters")
    .required("Contact number is required"),
  businessAddress: yup.string().required("Business Address is required"),
});

const Register = () => {
  // getting loading state from store as we dispatch data from here to redux thunk which will call our server
  const { loading } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // react form hook state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleRegister = async (data) => {
    // Dispatch registerSeller and unwrap the result
    await dispatch(registerSeller(data)).unwrap();

    // Redirect to OTP page on success
    if (registerSeller.fulfilled) {
      navigate("/otp");
    }
  };

  return (
    <section className="p-6 flex items-center justify-center bg-primary">
      <form
        className="bg-secondary shadow-md p-6 rounded-lg sm:w-[80%] md:w-[50%] lg:w-[40%]"
        onSubmit={handleSubmit(handleRegister)}
      >
        <div className="font-bold mb-4 flex items-center gap-1">
          <span>
            <AiFillAlipayCircle className="text-3xl text-blue-500" />
          </span>
          <span> {import.meta.env.VITE_PLATFORM_NAME}</span>
        </div>

        <h1 className="text-2xl">Join Our Seller Central Today!</h1>
        <p className="text-slate-500 text-xs my-1 md:text-sm">
          Register now to access our seller tools, track your sales, and reach
          millions of customers worldwide
        </p>
        <div>
          <label className="font-bold text-xs">Brand Name</label>
          <Input {...register("brandName")} />
          {errors.brandName && (
            <p className="text-red-500 text-xs">{errors.brandName.message}</p>
          )}
        </div>
        <div>
          <label className="font-bold text-xs">Brand Description</label>
          <Input {...register("brandDescription")} />
          {errors.brandDescription && (
            <p className="text-red-500 text-xs">
              {errors.brandDescription.message}
            </p>
          )}
        </div>
        <div>
          <label className="font-bold text-xs">Business Email</label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="font-bold text-xs">Contact Number</label>
          <Input {...register("contactNumber")} />
          {errors.contactNumber && (
            <p className="text-red-500 text-xs">
              {errors.contactNumber.message}
            </p>
          )}
        </div>
        <div>
          <label className="font-bold text-xs">Business Address</label>
          <Input {...register("businessAddress")} />
          {errors.businessAddress && (
            <p className="text-red-500 text-xs">
              {errors.businessAddress.message}
            </p>
          )}
        </div>
        <p className="text-xs my-2">
          By creating an account, you agree to our
          <span className="text-blue-600 cursor-default">
            {" "}
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-blue-600 cursor-default">Privacy Policy</span> .
        </p>

        <Button
          variant="primary"
          className="w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="text-xl animate-spin mx-auto" />
          ) : (
            "Register as a Seller"
          )}
        </Button>
        <p className="text-xs my-4 text-right">
          already registered?{" "}
          <Link
            className="text-blue-600 cursor-pointer hover:underline"
            to={"/login"}
          >
            login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
