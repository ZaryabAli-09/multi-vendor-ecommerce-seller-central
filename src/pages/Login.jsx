import React from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { Input } from "../components/common ui comps/Input";
import { Button } from "../components/common ui comps/Button";

const Login = () => {
  return (
    <section className="p-6 flex items-center justify-center">
      <form className=" bg-gray-50 p-6 rounded-lg sm:w-[80%] md:w-[50%] lg:w-[40%]">
        <div className="font-bold mb-4 flex items-center gap-1">
          <span>
            <AiFillAlipayCircle className="text-3xl text-blue-500" />
          </span>
          <span>Logo</span>
        </div>

        <h1 className="text-2xl">Welcome Back to Seller Central!</h1>
        <p className="text-slate-500 text-xs my-1 md:text-sm">
          "Log in to manage your store, track your sales, and stay connected
          with your customers worldwide.
        </p>
        <div>
          <label className="font-bold text-xs">Email</label>
          <Input />
        </div>
        <div>
          <label className="font-bold text-xs">Password</label>
          <Input />
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

        <Button variant="primary" className="w-full">
          Login as a Seller
        </Button>
        <p className="text-xs my-4 text-right">
          don't have an account?
          <span className="text-blue-600 cursor-default">register</span>
        </p>
        <p className="text-xs my-4 text-right">
          forgot your password?
          <span className="text-blue-600 cursor-default">reset password</span>
        </p>
      </form>
    </section>
  );
};

export default Login;
