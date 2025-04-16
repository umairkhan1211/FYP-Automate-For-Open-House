import Link from "next/link";
import Layout from "../../components/layouts/Layout";
import React, { useState } from "react";
import QAupload from "../../components/QAupload/QAupload";

export async function getServerSideProps({ req }) {
  const token = req.cookies.token;


  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token }, // Pass the token to the page as a prop
  };
}

function Index({ token }) {
  const [showUpload, setShowUpload] = useState(true);
  return (
    <>
      <Layout token={token}>
        <div className="pb-24">

        <div className="container h-[75vh] mx-auto ">
          <div className="my-5 space-x-2 mx-44">
            <button
              onClick={() => setShowUpload(true)} // Show upload boxes
              className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
                showUpload
                  ? "bg-[#0069D9] text-white border-[#0069D9]"
                  : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setShowUpload(false)} // Show notification component
              className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
                !showUpload
                  ? "bg-[#0069D9] text-white border-[#0069D9]"
                  : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
              }`}
            >
              Upload
            </button>
          </div>

          {showUpload ? (
            <div className="p-1 flex flex-col items-center justify-center">
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
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-12 h-12"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>

                        <span className="mt-4 font-bold text-xs uppercase pl-1.5">
                          Group 1
                        </span>
                      </Link>
                    </div>
                    <div className="mt-4 mx-52   ">
                      <Link href="/QAportal/Review">
                        <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                          Review
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
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-12 h-12"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>

                        <span className="mt-4 font-bold text-xs uppercase pl-1.5">
                          Group 2
                        </span>
                      </Link>
                    </div>
                    <div className="mt-4 mx-52 ">
                      <Link href="/QAportal/Review">
                        <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                          Review
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
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-12 h-12"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                          />
                        </svg>

                        <span className="mt-4 font-bold text-xs uppercase pl-1.5">
                          Group 3
                        </span>
                      </Link>
                    </div>
                    <div className="mt-4 mx-52   ">
                      <Link href="/QAportal/Review">
                        <button className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white">
                          Review
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          ) : (
            <QAupload/>
          )}
        </div>
        </div>
      </Layout>
    </>
  );
}

export default Index;
