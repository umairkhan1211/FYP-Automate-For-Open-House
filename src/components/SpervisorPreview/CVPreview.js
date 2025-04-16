import Link from "next/link";
import React, { useState } from "react";

export default function CVPreview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");

  const handleRejectClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rejection Reason:", reason);
    // Here you can handle the form submission to the backend
    setIsModalOpen(false);
  };

  const dummyCVData = {
    name: "Umair Khan",
    email: "umairkhanone0@gmail.com",
    education: "Bachelor of Science in Computer Science",
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: "Software Developer",
        duration: "Jan 2020 - Present",
      },
      {
        company: "Web Innovations",
        role: "Intern",
        duration: "Jun 2019 - Dec 2019",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "Python"],
  };

  return (
    <div className="p-2">
      <div className="my-2 space-x-2 mx-44">
        <Link href="/supervisorportal/Review">
          <button
            className={
              "border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-[#0069D9]"
            }
          >
            Back
          </button>
        </Link>
      </div>
      <div className="max-w-lg mx-auto p-6 border-2 border-[#0069D9] rounded-lg bg-white">
        <div>
          <p className="mb-2">
            <strong>Name:</strong> {dummyCVData.name}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {dummyCVData.email}
          </p>
          <p className="mb-4">
            <strong>Education:</strong> {dummyCVData.education}
          </p>
          <h3 className="text-xl font-semibold mb-2">Experience:</h3>
          <ul className="list-disc list-inside mb-4">
            {dummyCVData.experience.map((job, index) => (
              <li key={index} className="mb-2">
                <strong>{job.company}</strong> - {job.role} ({job.duration})
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-semibold mb-2">Skills:</h3>
          <ul className="list-disc list-inside">
            {dummyCVData.skills.map((skill, index) => (
              <li key={index} className="mb-1">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-end pt-4 max-w-lg mx-auto">
        <button className="bg-white text-white px-2 rounded disabled:opacity-50">
          <svg
            fill="#16ac34"
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="w-[32] h-[32] hover:border-2 rounded hover:rounded hover:border-white"
            viewBox="0 0 567.12 567.12"
            xmlSpace="preserve"
            stroke="#16ac34"
            strokeWidth="20.983551000000002"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <path d="M0,567.119h567.123V0.004H0V567.119z M56.818,283.477l43.556-43.568c5.404-5.404,11.812-8.109,19.217-8.109 c7.399,0,13.807,2.705,19.217,8.109l90.092,90.105l199.408-199.409c5.404-5.404,11.811-8.121,19.217-8.121 c7.398,0,13.807,2.717,19.217,8.121l43.557,43.55c5.402,5.422,8.113,11.824,8.113,19.217c0,7.405-2.711,13.813-8.113,19.217 L248.117,474.764c-5.41,5.422-11.818,8.121-19.217,8.121c-7.405,0-13.813-2.705-19.217-8.121L56.818,321.91 c-5.41-5.404-8.115-11.812-8.115-19.217C48.703,295.287,51.402,288.881,56.818,283.477z"></path>
                </g>
              </g>
            </g>
          </svg>
        </button>
        <button
          className="bg-white text-white rounded-full disabled:opacity-50"
          onClick={handleRejectClick}
        >
          <svg
            className="w-[43] h-[43] hover:border-2 fill-current hover:rounded-full hover:border-white"
            viewBox="0 0 512 512"
            version="1.1"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <style type="text/css">
                {`
                  .st0{fill:#f40101;}
                  .st1{fill:none;stroke:#f40101;stroke-width:32;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}
                `}
              </style>
              <g id="Layer_1"></g>
              <g id="Layer_2">
                <g>
                  <path
                    className="st0"
                    d="M263.24,43.5c-117.36,0-212.5,95.14-212.5,212.5s95.14,212.5,212.5,212.5s212.5-95.14,212.5-212.5 S380.6,43.5,263.24,43.5z M367.83,298.36c17.18,17.18,17.18,45.04,0,62.23v0c-17.18,17.18-45.04,17.18-62.23,0l-42.36-42.36 l-42.36,42.36c-17.18,17.18-45.04,17.18-62.23,0v0c-17.18-17.18-17.18-45.04,0-62.23L201.01,256l-42.36-42.36 c-17.18-17.18-17.18-45.04,0-62.23v0c17.18-17.18,45.04-17.18,62.23,0l42.36,42.36l42.36-42.36c17.18-17.18,45.04-17.18,62.23,0v0 c17.18,17.18,17.18,45.04,0,62.23L325.46,256L367.83,298.36z"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">CV Rejection</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Reason 
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter reason"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



