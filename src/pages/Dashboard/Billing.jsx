import React, { useEffect } from "react";
import { Input } from "../../components/common ui comps/Input";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/common ui comps/Button";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

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

const Billing = () => {
  const { user } = useSelector((state) => state.auth);
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

      if (!res.ok) {
        toast.error(result.message);
      } else {
        // Populate form inputs with fetched data
        setValue("bankDetails.bankName", result.data.bankDetails.bankName);
        setValue(
          "bankDetails.accountNumber",
          result.data.bankDetails.accountNumber
        );
        setValue(
          "bankDetails.accountHolderName",
          result.data.bankDetails.accountHolderName
        );

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
        <p> Billing Details</p>
        <label>Bank Name</label>
        <Input {...register("bankDetails.bankName")} />
        {errors.bankDetails?.bankName && (
          <p>{errors.bankDetails.bankName.message}</p>
        )}

        <label>Account Number</label>
        <Input {...register("bankDetails.accountNumber")} />
        {errors.bankDetails?.accountNumber && (
          <p>{errors.bankDetails.accountNumber.message}</p>
        )}

        <label>Account Holder Name</label>
        <Input {...register("bankDetails.accountHolderName")} />
        {errors.bankDetails?.accountHolderName && (
          <p>{errors.bankDetails.accountHolderName.message}</p>
        )}
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Billing;
