"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility state
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const watchedValues = useWatch({ control });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login", data);
      if (response.status === 200) {
        const { role, userId } = response.data; // Destructure userId from response
        localStorage.setItem("userId", userId); // Store the user ID in local storage
        toast.success("Login Successfully");
        switch (role.toLowerCase()) {
          case "student":
            router.push("/studentportal");
            break;
          case "supervisor":
            router.push("/supervisorportal");
            break;
          case "qa":
            router.push("/QAportal");
            break;
          case "hod":
            router.push("/HODportal");
            break;
          case "director":
            router.push("/Directorportal");
            break;
          default:
            toast.error("Access denied. Invalid role.");
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed! Please Sign up your Account."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      watchedValues.email &&
      watchedValues.password &&
      !errors.email &&
      !errors.password &&
      !loading
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [watchedValues, errors, loading]);

  return (
    <div className="h-[75vh] bg-gray-100 flex justify-center items-center">
      <div className="container w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-[#0069D9] rounded-md shadow-2xl px-8 pt-6 pb-8 mb-4 "
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/copywriting.gif"
              alt="Loading Animation"
              className="w-[48px] h-[48px] opacity-0 animate-fade-in"
            />
            <h1 className="text-center text-white font-extrabold text-xl">
              LOGIN
            </h1>
          </div>

          <div className="mb-4">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="shadow appearance-none outline-none border leading-tight border-gray-300 bg-gray-100 text-black rounded w-full py-1.5 px-3"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", { required: "Password is required" })}
              className="shadow appearance-none outline-none border leading-tight border-gray-300 bg-gray-100 text-black rounded w-full py-1.5 px-3 pr-10"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-[#0069D9] hover:text-gray-700"
            >
              <i className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i>
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className={`border border-gray-900 text-[#0069D9] font-bold bg-white rounded mr-2 p-2 flex items-center justify-center gap-2 ${
              buttonDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-[#0069D9] hover:text-white hover:border-white"
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-[#0069D9]"></div>
                LOGGING IN...
              </>
            ) : (
              "LOGIN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
