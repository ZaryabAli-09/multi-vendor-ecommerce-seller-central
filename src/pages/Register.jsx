import React from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { Input } from "../components/common ui comps/Input";
import { Button } from "../components/common ui comps/Button";

const Register = () => {
  return (
    <section className="p-6 flex items-center justify-center">
      <form className=" bg-gray-50 p-6 rounded-lg sm:w-[80%] md:w-[50%] lg:w-[40%]">
        <div className="font-bold mb-4 flex items-center gap-1">
          <span>
            <AiFillAlipayCircle className="text-3xl text-blue-500" />
          </span>
          <span>Logo</span>
        </div>

        <h1 className="text-2xl">Join Our Seller Central Today!</h1>
        <p className="text-slate-500 text-xs my-1 md:text-sm">
          Register now to access our seller tools, track your sales, and reach
          millions of customers worldwide
        </p>
        <div>
          <label className="font-bold text-xs">Brand Name</label>
          <Input />
        </div>
        <div>
          <label className="font-bold text-xs">Brand Description</label>
          <Input />
        </div>
        <div>
          <label className="font-bold text-xs">Business Email</label>
          <Input />
        </div>
        <div>
          <label className="font-bold text-xs">Contact Number</label>
          <Input />
        </div>
        <div>
          <label className="font-bold text-xs">Business Address</label>
          <Input />
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

        <Button variant="primary" className="w-full">
          Register as a Seller
        </Button>
        <p className="text-xs my-4 text-right">
          already registered?
          <span className="text-blue-600 cursor-default"> login</span>
        </p>
      </form>
    </section>
  );
};

export default Register;
