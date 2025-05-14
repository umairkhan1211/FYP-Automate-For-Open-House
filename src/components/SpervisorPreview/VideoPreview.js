import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";

export default function VideoPreview({
  studentId,
  rollNumber,
  supervisorId,
  supervisorRole,
  projectTitle,
  videoUrl,
  bannerImage,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectionType, setRejectionType] = useState(""); // "Video" or "Banner Image"
  const [videoPath, setvideoPath] = useState(videoUrl);
  const [bannerPath, setbannerPath] = useState(bannerImage);


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // 1. Send rejection notification
    await axios.post("/api/Notification/FYPNotification", {
      studentId,
      rollNumber,
      supervisorId,
      userRole: supervisorRole,
      type: rejectionType, // "Video" or "Banner Image"
      optionalMessage: reason,
    });

    // 2. Remove respective media path
    if (rejectionType === "Video") {
      await axios.put("/api/SupervisorDelete/RemoveVideoUrl", {
        studentId,
      });
        setvideoPath(null);
    } else if (rejectionType === "Banner Image") {
      await axios.put("/api/SupervisorDelete/RemoveBannerImage", {
        studentId,
      });
        setbannerPath(null);
    }

    console.log("Notification sent and media path removed successfully");
    window.location.reload();
  } catch (error) {
    console.error("Error submitting rejection:", error);
  }

  setIsModalOpen(false);
  setReason("");
};


  const handleRejectClick = (type) => {
    setRejectionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReason("");
    setRejectionType("");
  };

  const handleDownload = () => {
    const imagePath = bannerImage.replace(/^public\//, "");
    const downloadUrl = `/api/FetchRecords/GetBannerdownload?imagePath=${encodeURIComponent(
      imagePath
    )}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.click();
  };

  const getVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|(?:.*[?&]v=))|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  return (
    <div className="p-4 pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <Link href="/supervisorportal/Review">
          <button className="border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-[#0069D9]">
            Back
          </button>
        </Link>

        <h3 className="text-lg font-extrabold text-[#0069D9] text-center">
          Video Preview
        </h3>

        <div className="space-y-4 mt-4">
          {/* Video Section */}
          <div className="p-1">
            <div className="border-2 border-[#0069D9] p-6 rounded-lg">
              <label className="block font-bold mb-2 text-[#0069D9] text-base">
                Demo Video
              </label>
              {videoUrl && getVideoId(videoUrl) ? (
                <div className="space-y-2">
                  <div className="p-2">
                    <iframe
                      width="100%"
                      height="280"
                      src={`https://www.youtube.com/embed/${getVideoId(videoUrl)}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              ) : (
                <p className="text-red-500 text-center">
                  Video URL is not uploaded.
                </p>
              )}
            </div>

            {/* Review Buttons */}
            {videoUrl && getVideoId(videoUrl) ? (
            <div className="flex justify-end pt-4 space-x-4">
              <button
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
                title="Approve"
              >
                 <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => handleRejectClick("Video")}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                title="Reject"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>):("")}
          </div>

          {/* Banner Image Section */}
          <div className="p-1">
            <div className="border-2 border-[#0069D9] p-6 rounded-lg">
              <label className="block font-bold text-[#0069D9] text-base mb-2">
                Banner Image
              </label>
              {bannerImage ? (
                <div>
                  <Image
                    src={`/${bannerImage.replace(/^public\//, "")}`}
                    width={200}
                    height={200}
                    alt="Banner Image"
                    className="shadow-md rounded"
                  />
                </div>
              ) : (
                <p className="text-red-500 text-center">
                  Banner image is not uploaded.
                </p>
              )}

              {bannerImage && (
                <button
                  onClick={handleDownload}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              )}
            </div>

            {/* Review Buttons */}
               {bannerImage && (
            <div className="flex justify-end pt-4 space-x-4">
              <button
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
                title="Approve"
              >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => handleRejectClick("Banner Image")}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                title="Reject"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>)}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute font-black top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &#10005;
            </button>

            <div className="mb-4 text-sm text-gray-700 flex space-x-3">
              <p className="bg-gray-300 rounded-full px-4 py-1 font-bold text-[#0069D9]">
                {rejectionType}
              </p>
              <p className="bg-gray-300 rounded-full px-4 py-1 font-bold text-[#0069D9]">
                {projectTitle || "Project Title Missing"}
              </p>
            </div>

            <h2 className="text-lg font-bold mb-4 text-[#0069D9]">
              Reason for Rejection
            </h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter your reason..."
                className="w-full border border-gray-300 rounded p-2 mb-4 text-black"
                rows={4}
                required
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Submit
                </button>
              </div>
            </form>

            <div className="mt-6 space-y-2">
              <h3 className="text-lg font-semibold text-[#0069D9]">
                Student Details
              </h3>
              <div className="flex justify-between text-sm text-gray-700">
                <p>
                  <strong>Student ID:</strong>{" "}
                  {Array.isArray(studentId)
                    ? studentId.join(", ")
                    : studentId}
                </p>
                <p>
                  <strong>Roll Number:</strong>{" "}
                  {Array.isArray(rollNumber)
                    ? rollNumber.join(", ")
                    : rollNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
