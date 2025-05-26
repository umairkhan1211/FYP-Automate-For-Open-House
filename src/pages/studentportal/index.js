import Link from "next/link";
import Layout from "../../components/layouts/Layout";
import React, { useEffect, useState } from "react";
import StudentNotification from "../../components/Notification/StudentNotification";
import jwt from "jsonwebtoken"; // Import jsonwebtoken
import axios from "axios";

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

  // Decode the token to extract user information without verifying
  let userData;
  try {
    userData = jwt.decode(token); // Decode the token without verifying
    if (!userData) {
      throw new Error("Failed to decode token");
    }
  } catch (error) {
    console.error("Token decoding failed:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token, userData }, // Pass the token and userData to the page as props
  };
}

function Index({ token, userData }) {
  console.log("dadta user ka", userData);
  const [showUpload, setShowUpload] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const response = await axios.get(
          `/api/Notification/FetchNotification?userId=${userData.id}&role=student`
        );
        setNotificationCount(response.data.notifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userData?.id) {
      fetchNotificationCount();
    }
  }, [userData?.id]);
  return (
    <Layout token={token}>
      <div className="container h-full w-full pb-10 mx-auto ">
        <div className=" flex w-9/12 min-w-lg mx-auto p-6 justify-between">
          <div className=" space-x-2">
            <button
              onClick={() => setShowUpload(true)}
              className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
                showUpload
                  ? "bg-[#0069D9] text-white border-[#0069D9]"
                  : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setShowUpload(false)}
              className={`border-2 rounded-lg text-md font-semibold py-1 px-2 relative ${
                !showUpload
                  ? "bg-[#0069D9] text-white border-[#0069D9]"
                  : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
              }`}
            >
              Notification
              {/* Notification badge */}
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
          <div className="text-[#0069D9] text-md font-semibold flex space-x-2 justify-center items-center">
            <p className="bg-gray-300 rounded-lg py-1.5 px-2 capitalize">{userData.department}</p>
            <p className="bg-gray-300 rounded-lg py-1.5 px-2 capitalize">{userData.rollNumber}</p>
          </div>
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
                  <div className="mt-4 mx-24 flex space-x-1 ">
                    <Link href="/studentportal/Upload?type=cv">
                      <button className="flex items-center gap-2 border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white group">
                        Upload
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          className="fill-[#0069D9] group-hover:fill-white transition-all duration-200"
                        >
                          <path d="M10,24c-1.66,0-3-1.34-3-3V13h-1.92c-1.17,0-2.29-.62-2.8-1.67-.57-1.18-.34-2.51,.57-3.43L9.17,1.18c1.57-1.57,4.09-1.57,5.64-.02l6.37,6.77c.85,.84,1.1,2.09,.63,3.22-.47,1.13-1.52,1.84-2.74,1.85h-2.06v8c0,1.66-1.34,3-3,3h-4Z" />
                        </svg>
                      </button>
                    </Link>
                    <Link href="/studentportal/Preview?type=cv">
                      <button className="flex items-center gap-2 border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white group">
                        Preview
                        <i class="bi bi-search "></i>
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
                  <div className="mt-4 mx-24 flex space-x-1 ">
                    <Link href="/studentportal/Upload?type=fyp">
                      <button className="flex items-center gap-2 border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white group">
                        Upload
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          className="fill-[#0069D9] group-hover:fill-white transition-all duration-200"
                        >
                          <path d="M10,24c-1.66,0-3-1.34-3-3V13h-1.92c-1.17,0-2.29-.62-2.8-1.67-.57-1.18-.34-2.51,.57-3.43L9.17,1.18c1.57-1.57,4.09-1.57,5.64-.02l6.37,6.77c.85,.84,1.1,2.09,.63,3.22-.47,1.13-1.52,1.84-2.74,1.85h-2.06v8c0,1.66-1.34,3-3,3h-4Z" />
                        </svg>
                      </button>
                    </Link>
                    <Link href="/studentportal/Preview?type=fyp">
                      <button className="flex items-center gap-2 border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white group">
                        Preview
                        <i class="bi bi-search  "></i>
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
                  <div className="mt-4 mx-24 flex space-x-1 ">
                    <Link href="/studentportal/Upload?type=video">
                      <button className="flex items-center gap-2 border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white group">
                        Upload
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          className="fill-[#0069D9] group-hover:fill-white transition-all duration-200"
                        >
                          <path d="M10,24c-1.66,0-3-1.34-3-3V13h-1.92c-1.17,0-2.29-.62-2.8-1.67-.57-1.18-.34-2.51,.57-3.43L9.17,1.18c1.57-1.57,4.09-1.57,5.64-.02l6.37,6.77c.85,.84,1.1,2.09,.63,3.22-.47,1.13-1.52,1.84-2.74,1.85h-2.06v8c0,1.66-1.34,3-3,3h-4Z" />
                        </svg>
                      </button>
                    </Link>
                    <Link href="/studentportal/Preview?type=video">
                      <button className="flex items-center gap-2 border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white group">
                        Preview
                        <i class="bi bi-search  "></i>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <StudentNotification userId={userData.id}   updateNotificationCount={setNotificationCount} /> // Render the Notification component
        )}
      </div>
    </Layout>
  );
}

export default Index;
