import React from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { Input } from "../components/common ui comps/Input";
import { Button } from "../components/common ui comps/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { login } from "../store/authReducers";

// form validation as yup

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be 8 characters long")
    .required("Please enter your password"),
});

const Login = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogin = async (data) => {
    await dispatch(login(data)).unwrap();

    if (login.fulfilled) {
      console.log("fullfilled");
    }
  };

  return (
    <section className="p-6 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className=" bg-gray-50 p-6 rounded-lg sm:w-[80%] md:w-[50%] lg:w-[40%]"
      >
        <div className="font-bold mb-4 flex items-center gap-1">
          <span>
            <AiFillAlipayCircle className="text-3xl text-blue-500" />
          </span>
          <span>Logo</span>
        </div>

        <h1 className="text-2xl">Welcome Back to Seller Central!</h1>
        <p className="text-slate-500 text-xs my-1 md:text-sm">
          Log in to manage your store, track your sales, and stay connected with
          your customers worldwide.
        </p>
        <div>
          <label className="font-bold text-xs">Email</label>
          <Input {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="font-bold text-xs">Password</label>
          <Input {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <p className="text-xs my-2">
          By logging in, you agree to our
          <span className="text-blue-600 cursor-pointer">
            {" "}
            Terms of Service
          </span>{" "}
          and
          <span className="text-blue-600 cursor-pointer"> Privacy Policy</span>.
        </p>

        <Button type="submit" variant="primary" className="w-full">
          Login as a Seller
        </Button>
        <div className="text-[10px] my-4 flex items-center justify-between">
          <p>
            don't have an account? {""}
            <Link className="text-blue-600 cursor-default" to={"/"}>
              register
            </Link>
            <span></span>
          </p>

          <Link
            className="text-blue-600 cursor-default"
            to={"/forgot-password"}
          >
            forgot password?
          </Link>
        </div>
      </form>
    </section>
  );
};

export default Login;
