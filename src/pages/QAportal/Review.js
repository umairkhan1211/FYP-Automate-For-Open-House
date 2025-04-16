import Layout from "../../components/layouts/Layout";
import Link from "next/link";
import React, { useState } from "react";

export async function getServerSideProps({ req }) {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { token }, // Pass the token to the page as a prop
  };
}



export default function Review({ token }) {
  return (
    <Layout token={token}>
      <div className="container h-[75vh] mx-auto ">
        <div className="my-5 space-x-2 mx-44">
          <Link href="/QAportal">
            <button
              className={
                "border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-[#0069D9]"
              }
            >
              Back
            </button>
          </Link>
        </div>
        <div className=" flex flex-col items-center justify-center">
          <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3">
            <div className="box p-3">
              <div className="w-72 rounded-lg bg-[#0069D9] py-4">
                <div className="pl-4">
                  <Link
                    href="#"
                    className="text-white cursor-pointer hover:text-gray-200 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                      />
                    </svg>
                    <span className="mt-4 font-bold text-xs uppercase pl-1.5">
                      CV
                    </span>
                  </Link>
                </div>
                <div className="mt-4 mx-28 flex space-x-2 ">
                  <Link href="/QAportal/Preview?type=cv">
                    <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                      Preview
                    </button>
                  </Link>
                  <Link href="#">
                    <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                      Download
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="box p-3">
              <div className="w-72 rounded-lg bg-[#0069D9] py-4">
                <div className="pl-4">
                  <Link
                    href="#"
                    className="text-white cursor-pointer hover:text-gray-200 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>

                    <span className="mt-4 font-bold text-xs uppercase pl-1.5">
                      FYP Document
                    </span>
                  </Link>
                </div>
                <div className="mt-4 mx-28 flex space-x-2 ">
                  <Link href="/QAportal/Preview?type=fyp">
                    <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                      Preview
                    </button>
                  </Link>
                  <Link href="#">
                    <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                      Download
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="box p-3">
              <div className="w-72 rounded-lg bg-[#0069D9] py-4">
                <div className="pl-4">
                  <Link
                    href="#"
                    className="text-white cursor-pointer hover:text-gray-200 "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-12 h-12"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>

                    <span className=" mt-4 font-bold text-xs uppercase pl-1">
                      Video URL
                    </span>
                  </Link>
                </div>
                <div className="mt-4 mx-52 ">
                  <Link href="/QAportal/Preview?type=video">
                    <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                      Preview
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
