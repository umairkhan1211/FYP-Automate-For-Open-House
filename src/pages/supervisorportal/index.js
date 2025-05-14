import React, { useState, useEffect } from "react";
import Link from "next/link";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import SupervisorNotification from "../../components/Notification/SupervisorNotification";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

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
  let supervisorData;
  try {
    supervisorData = jwt.decode(token); // Decode the token without verifying
    if (!supervisorData) {
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
    props: { token, supervisorData }, // Pass the token and userData to the page as props
  };
}

function Index({ token, supervisorData }) {
  const [showUpload, setShowUpload] = useState(true);
  const [studentGroups, setStudentGroups] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("/api/FetchRecords/Group", {
          params: {
            role: "student",
            supervisorId: supervisorData.id,
          },
        });

        const groups = response.data.reduce((acc, student) => {
          if (!acc[student.projectTitle]) {
            acc[student.projectTitle] = [];
          }
          acc[student.projectTitle].push(student);
          return acc;
        }, {});

        setStudentGroups(groups);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [supervisorData]);

  const splitTitle = (title) => {
    const maxLength = 15;
    const words = title.split(" ");
    const lines = [];
    let currentLine = "";

    words.forEach((word) => {
      if ((currentLine + word).length > maxLength) {
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });

    if (currentLine) {
      lines.push(currentLine.trim());
    }

    return lines;
  };

  // Storing data in session storage
  const handleReviewClick = (projectTitle, students) => {
    sessionStorage.setItem("students", JSON.stringify(students));
    sessionStorage.setItem("projectTitle", projectTitle);
  };

  return (
    <Layout token={token}>
      <div className="container h-full w-full pb-10 mx-auto">
        <div className="w-9/12 min-w-lg mx-auto p-6 space-x-2">
          <button
            onClick={() => setShowUpload(true)}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
              showUpload
                ? "bg-[#0069D9] text-white border-[#0069D9]"
                : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setShowUpload(false)}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
              !showUpload
                ? "bg-[#0069D9] text-white border-[#0069D9]"
                : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
            }`}
          >
            Notification
          </button>
        </div>

        {showUpload ? (
          <div className="flex flex-col items-center justify-center">
            <div className="grid grid-cols-1 gap-1 mx-auto w-9/12">
              {Object.entries(studentGroups).map(
                ([projectTitle, students], index) => (
                  <div key={index} className="box p-3">
                    <div className="rounded-lg bg-[#0069D9] p-6 flex items-center justify-between">
                      <div className="flex flex-col items-center text-center">
                        <Link
                          href="#"
                          className="text-white cursor-pointer hover:text-gray-200"
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
                              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                            />
                          </svg>
                        </Link>
                        {splitTitle(projectTitle).map((line, idx) => (
                          <span
                            key={idx}
                            className="mt-2 font-semibold text-xs uppercase bg-white text-[#0069D9] rounded p-1"
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {line}
                          </span>
                        ))}
                      </div>

                      <div className="flex-grow text-center  ">
                        <div className="mt-2 font-semibold capitalize text-white   ">
                          {students.map((student, idx) => (
                            <span key={idx} className="text-sm  ">
                              {student.rollNumber}
                              <br />
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <Link
                          href={{
                            pathname: "/supervisorportal/Review",
                            query: {
                              supervisorId: supervisorData.id,
                              supervisorRole: supervisorData.role,
                            },
                          }}
                        >
                          <button
                            onClick={() =>
                              handleReviewClick(projectTitle, students)
                            }
                            className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white"
                          >
                            Review
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <SupervisorNotification userId={supervisorData.id} />
        )}
      </div>
    </Layout>
  );
}

export default Index;
