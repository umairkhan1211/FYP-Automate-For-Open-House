import Layout from "../../components/layouts/Layout";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
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

  // Decode token to get user id and role
  const decoded = jwt.decode(token);
  console.log(decoded);
  const supervisorId = decoded?.id || null;
  const supervisorRole = decoded?.role || null;

  return {
    props: { token, supervisorId, supervisorRole },
  };
}
export default function Review({ token, supervisorId, supervisorRole }) {
  const [studentsWithData, setStudentsWithData] = useState([]);
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState("");
  const [studentList, setStudentList] = useState([]);
  const [fypData, setFypData] = useState({});

  const handlePreview = (rollNumber, studentId) => {
    if (!rollNumber) {
      console.error("Roll number not provided!");
      return;
    }
    console.log(
      "Navigating to preview with rollNumber:",
      rollNumber,
      "and studentId:",
      studentId
    );
    router.push({
      pathname: `/supervisorportal/Preview`,
      query: {
        type: "cv",
        rollNumber,
        studentId,
        supervisorId,
        supervisorRole,
      },
    });
  };

  const handleFypPreview = () => {
    const previewObj = {
      type: "fyp",
      studentIds: fypData.fypPreviewData.map((s) => ({
        _id: s._id,
        rollNumber: s.rollNumber,
      })),
      projectTitle: fypData.projectTitle,
      fypPreviewData: fypData.fypPreviewData, // full preview data bhej do
      supervisorId,
      supervisorRole,
    };

    console.log("previewobjFYp", previewObj);

    sessionStorage.setItem("previewData", JSON.stringify(previewObj));
    console.log(previewObj);
    router.push("/supervisorportal/Preview");
  };

  const handleVideoPreview = () => {
    const previewObj = {
      type: "video",
      studentIds: fypData.videoPreviewData.map((s) => ({
        _id: s._id,
        rollNumber: s.rollNumber,
      })),
      projectTitle: fypData.projectTitle,
      videoPreviewData: fypData.videoPreviewData, // full preview data bhej do
      supervisorId,
      supervisorRole,
    };

    console.log("previewobjvideo", previewObj);

    sessionStorage.setItem("previewData", JSON.stringify(previewObj));
    console.log(previewObj);
    router.push("/supervisorportal/Preview");
  };

  const handleDownload = async (rollNumber) => {
    try {
      // Fetch file data from API
      const response = await axios.get(
        `/api/FetchRecords/GetCv?rollNumber=${rollNumber}`
      );

      const file = response.data;

      if (!file) {
        console.error("No file data found.");
        return;
      }

      if (file.cvFilePath) {
        // Ensure the file path is correct for public directory serving
        const fullCvUrl = `/uploads/${file.cvFilePath.split("/").pop()}`;

        // Fetch the file
        const fileResponse = await axios.get(fullCvUrl, {
          responseType: "blob",
        });

        // Trigger the download
        const url = window.URL.createObjectURL(new Blob([fileResponse.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.cvFilePath.split("/").pop());
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.error("CV file path is missing in the response.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  console.log("nikalo sareh",fypData)

  useEffect(() => {
    const storedStudents = sessionStorage.getItem("students");
    const storedProjectTitle = sessionStorage.getItem("projectTitle");
    console.log(storedStudents);

    if (storedStudents && storedProjectTitle) {
      const parsedStudents = JSON.parse(storedStudents);

      setStudentList(parsedStudents);
      setProjectTitle(storedProjectTitle);

      // Filter IDs with role "student" and get _id and rollNumber

      const studentIds = parsedStudents
        .filter((student) => student.role === "student")
        .map((student) => student._id);

      if (studentIds.length > 0) {
        const apiUrl = `/api/FetchRecords/GetFYPandVideo?userIds=${studentIds.join(
          ","
        )}`;

        axios
          .get(apiUrl)
          .then((response) => {
            const studentsWithData = response.data.students; // ✅ Define it here
            console.log("Students with uploaded data:", studentsWithData);

            // Prepare data for FYP Preview
            const fypPreviewData = studentsWithData
              .filter((s) => s.fypDocumentPath)
              .map((s) => ({
                _id: s.userId,
                rollNumber: s.rollNumber,
                fypDocument: s.fypDocumentPath,
              }));
              console.log("fyppreviewdata", fypPreviewData);

            // Prepare data for Video Preview
            const videoPreviewData = studentsWithData
              .filter((s) => s.videoUrl || s.bannerImageFilePath)
              .map((s) => ({
                _id: s.userId,
                rollNumber: s.rollNumber,
                videoUrl: s.videoUrl,
                bannerImage: s.bannerImageFilePath,
              }));

            console.log("videopreviewdata", videoPreviewData);

            setFypData({
              projectTitle: storedProjectTitle,
              fypPreviewData,
              videoPreviewData,
            });
          })

          .catch((error) => {
            console.error("Error fetching FYP and Video data:", error);
          });
      } else {
        console.warn("No student IDs found.");
      }
    } else {
      console.warn("⚠️ Students or Project Title not found in sessionStorage.");
    }
  }, []);

  return (
    <Layout token={token}>
      <div className="container h-full w-full mx-auto ">
        <div className="w-9/12 min-w-lg mx-auto pt-4">
          <Link href="/supervisorportal">
            <button
              className={
                "border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-[#0069D9]"
              }
            >
              Back
            </button>
          </Link>
        </div>
        <h1 className="text-[#0069D9] font-extrabold text-lg text-center mb-2">
          CV of {projectTitle}
        </h1>
        <hr className="border-t-2 border-[#0069D9] " />

        <div className="flex flex-col items-center justify-center mt-3">
          <div className="grid grid-cols-1 mx-auto md:grid-cols-2 lg:grid-cols-3">
            {studentList.map((student, index) => (
              <div key={index} className="box p-3">
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
                      <span className="mt-4 font-extrabold text-base uppercase pl-1.5">
                        CV
                      </span>
                      <span className="font-bold text-xs uppercase pl-1.5">
                        ( {student.rollNumber} )
                      </span>
                    </Link>
                  </div>
                  <div className="mt-4 mx-28 flex space-x-2 ">
                    <Link
                      href={`/supervisorportal/preview?type=cv&rollNumber=${
                        (student.rollNumber, student._id)
                      }`}
                    >
                      <button
                        onClick={() =>
                          handlePreview(student.rollNumber, student._id)
                        }
                        className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white"
                      >
                        Preview
                      </button>
                    </Link>

                    <Link href="#">
                      <button
                        onClick={() => handleDownload(student.rollNumber)}
                        className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white"
                      >
                        Download
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <h1 className="text-[#0069D9] font-extrabold text-lg text-center mt-3 mb-2">
          FYP Document of {projectTitle}
        </h1>
        <hr className="border-t-2  border-[#0069D9]  " />
        <div className="flex flex-col items-center justify-center mt-3">
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>

                    <span className="mt-4 font-bold text-xs uppercase pl-1.5">
                      FYP Document
                    </span>
                  </Link>
                </div>
                <div className="mt-4 mx-52 ">
                  <button
                    onClick={handleFypPreview}
                    className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className="text-[#0069D9] font-extrabold text-lg text-center mb-2">
          Video URL & Banner Image
        </h1>
        <hr className="border-t-2 border-[#0069D9] " />
        <div className="flex flex-col items-center justify-center mt-3 mb-3">
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
                        d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>

                    <span className=" mt-4 font-bold text-xs uppercase pl-1">
                      Video URL
                    </span>
                  </Link>
                </div>
                <div className="mt-4 mx-52 ">
                  <button
                    onClick={handleVideoPreview}
                    className="border border-gray-50 text-[#0069D9] text-md font-semibold bg-white rounded p-1 hover:bg-[#0069D9] hover:text-white hover:border-white"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
