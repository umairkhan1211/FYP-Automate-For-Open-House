"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Header({ token }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
      setUserRole(decodedToken.role);
      setUserName(decodedToken.name || "User"); // Default name if not available
      setUserEmail(decodedToken.email || "user@example.com"); // Default email if not available
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/users/logout");
      toast.success("Logout Successfully");
      document.cookie = "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict";
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 p-12 transition-all duration-300  border-b-2 border-gray-100  ${
        isLoggedIn ? "bg-[#0069D9] text-white" : "bg-gray-100 text-[#0069D9]"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between relative transition-all duration-300 ">
        {/* Left Side: Logo + Heading */}
        <div className="flex absolute left-0 transition-all duration-300 ">
          <div className="flex items-center space-x-2 transition-all duration-300 ">
            <Link href={"#"}>
              <Image
                alt="QAforfyp"
                src="/QAforfyp.png"
                width={90}
                height={90}
              />
            </Link>
          </div>
          <div className=" flex flex-col items-start mt-4 ml-2 title-font font-extrabold uppercase">
            <h1 className=" font-extrabold text-2xl capitalize transition-all duration-300 ">
              FYP Automate
            </h1>
            <span className=" font-semibold text-xs capitalize transition-all duration-300 ">
              For Open House
            </span>
          </div>
        </div>

        {/* Center: User Role */}
        {isLoggedIn && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <h1 className="font-extrabold text-2xl text-white uppercase">
              {userRole} Portal
            </h1>
          </div>
        )}

        {/* Right Side: User Details + Logout */}
        {isLoggedIn && (
          <div className="absolute right-0 flex items-center space-x-4">
            {/* User Details */}
            <div className="flex text-white text-right">
              <div className="flex items-center space-x-2">
                <i className="bi bi-person-circle text-4xl"></i>
              </div>
              <div className="flex flex-col items-start ml-2">
                <h5 className="font-extrabold capitalize italic ">{userName}</h5>
                <smalls className="text-xs text-gray-200 italic">{userEmail}</smalls>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="py-2 px-3 text-2xl text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              onClick={handleLogout}
            >
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
