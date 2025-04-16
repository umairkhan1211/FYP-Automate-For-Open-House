"use client";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

function AddStudent({ darkMode }) {
  const {
    register,
    handleSubmit,
    control,
    reset, // Add this line
    formState: { errors },
  } = useForm();

  const [formKey, setFormKey] = useState(0);
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Watch form values
  const watchedValues = useWatch({ control });

  const onSubmit = async (data) => {
    setLoading(true); // Ensure loading is set at the beginning
    try {
      const studentData = { ...data, role: "Student" }; // Automatically setting role as "Student"
      const response = await axios.post("/api/users/signup", studentData);
      console.log(response.data);

      toast.success("Student Added Successfully!");

      // Reset the form fields
      reset();
      setFormKey((prevKey) => prevKey + 1); //  Update key to force re-render
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error("Failed to Add Student");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { email, password, name, department, rollNumber } =
      watchedValues || {};
    if (email && password && name && department && rollNumber) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [watchedValues]);

  return (
    <div
      className={`flex items-center justify-center w-full h-full overflow-hidden ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="w-full max-w-md  dark:bg-slate-800 border-2 border-[#0069D9] dark:border-white rounded-md shadow-2xl p-6 overflow-auto max-h-[85vh]">
        {/* Small Lottie Animation */}
        <div className="flex items-center justify-center space-x-2 mb-4 ">
          <img
            src="/user.gif"
            alt="Loading Animation"
            className="w-[70px] h-[70px] opacity-0 animate-fade-in"
          />

          {/* <iframe src="https://lottie.host/embed/4c8a2ba7-a721-4f1e-99d0-c4a00adb8cae/AK1PAssf5p.lottie"
       
            className="w-[55px] h-[55px] opacity-0 animate-fade-in"
       ></iframe> */}
          {/* <iframe
            src="https://lottie.host/embed/4522365f-b57d-4f80-8093-7f21c0dbe8fe/QdqqQ6Ub3C.lottie"
          ></iframe> */}
          <h1 className="text-center text-[#0069D9] dark:text-white  font-extrabold text-lg ">
            ADD STUDENT
          </h1>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Input */}
          <div>
            <input
              {...register("name", {
                required: "Name is required",
                pattern: {
                  value: /^[a-zA-Z0-9 ]{5,20}$/,
                  message:
                    "Name must be 5-20 characters long without special characters",
                },
              })}
              type="text"
              className="leading-tight border-2 border-[#0069D9] rounded w-full py-1.5 px-3 dark:bg-slate-800 dark:text-white dark:border-white"
              placeholder="Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              type="email"
              className="leading-tight border-2 border-[#0069D9] rounded w-full py-1.5 px-3 dark:bg-slate-800 dark:text-white dark:border-white"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: /^\d{6,}$/,
                    message: "Password must be 6 digits long",
                  },
                })}
                type={showPassword ? "text" : "password"}
                className="border-2 border-[#0069D9] dark:border-white rounded w-full py-1.5 px-3 dark:bg-slate-800 dark:text-white"
                placeholder="Password"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer  text-[#0069D9] dark:text-white text-xs font-black italic py-1 leading-tight"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </span>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Roll Number Input */}
          <div>
            <input
              {...register("rollNumber", {
                required: "Roll number is required",
                pattern: {
                  value:
                    /^(fa|FA|SP|sp)\d{2}-(BSE|BCS|BBA|BEE|BME|bse|bcs|bba|bme|bee)-\d{3}$/i,
                  message: "Invalid roll number format (e.g., fa21-bse-070)",
                },
              })}
              type="text"
              className="leading-tight border-2 border-[#0069D9] rounded w-full py-1.5 px-3 dark:bg-slate-800 dark:text-white dark:border-white"
              placeholder="fa21-bse-070"
            />
            {errors.rollNumber && (
              <p className="text-red-500 text-sm">
                {errors.rollNumber.message}
              </p>
            )}
          </div>

          {/* Department Select */}
          <div>
            <label className="block text-[#0069D9] font-bold text-base mb-1 dark:text-white">
              Department
            </label>
            <select
              {...register("department", { required: true })}
              className="leading-tight border-2 border-[#0069D9] rounded w-full py-1.5 px-3 dark:bg-slate-800 dark:text-white dark:border-white"
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Mechanical Engineering">
                Mechanical Engineering
              </option>
              <option value="Business Administration">
                Business Administration
              </option>
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm">
                {errors.department.message}
              </p>
            )}
          </div>

          {/* Hidden Input for Role */}
          <input type="hidden" {...register("role")} value="Student" />

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full border-2 border-[#0069D9] text-white font-bold bg-[#0069D9] rounded-md p-2 dark:bg-blue-600 dark:border-white hover:bg-blue-600 hover:text-white hover:border-blue-600 ${
              buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={buttonDisabled || loading}
          >
            {loading ? "ADDING ..." : "ADD"}
          </button>
        </form>
      </div>
      <div className="absolute bottom-4 right-4 opacity-0 animate-fade-in">
        <iframe
          src="https://lottie.host/embed/45057d1b-7eda-4753-875f-0baeda2a9ff6/pXyptKGWgV.lottie"
          className="w-20 h-20"
        ></iframe>
      </div>
    </div>
  );
}

export default AddStudent;
