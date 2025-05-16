import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
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
  const [rejectionType, setRejectionType] = useState("");
  const [videoPath, setVideoPath] = useState(videoUrl);
  const [bannerPath, setBannerPath] = useState(bannerImage);
  const [isVideoApproved, setIsVideoApproved] = useState(false);
  const [isBannerApproved, setIsBannerApproved] = useState(false);
  

  useEffect(() => {
    if (!studentId || !supervisorId) return;

    // Fetch video approval status
    const fetchVideoStatus = async () => {
      try {
        const response = await axios.get("/api/Status/SupVideoSubmitStatus", {
          params: { studentId, supervisorId },
        });
        if (response.data?.supervisorVideoReview === "approved") {
          setIsVideoApproved(true);
        }
      } catch (error) {
        console.error("Error fetching video status:", error);
      }
    };

    // Fetch banner approval status
    const fetchBannerStatus = async () => {
      try {
        const response = await axios.get("/api/Status/SupBannerSubmitStatus", {
          params: { studentId, supervisorId },
        });
        if (response.data?.supervisorBannerReview === "approved") {
          setIsBannerApproved(true);
        }
      } catch (error) {
        console.error("Error fetching banner status:", error);
      }
    };

    fetchVideoStatus();
    fetchBannerStatus();
  }, [studentId, supervisorId]);

  const openRejectionModal = (type) => {
    setRejectionType(type);
    setIsModalOpen(true);
  };

  const handleRejection = async (e) => {
    e.preventDefault();
    try {
      // 1. Send rejection notification
      await axios.post("/api/Notification/FYPNotification", {
        studentId,
        rollNumber,
        supervisorId,
        userRole: supervisorRole,
        type: rejectionType,
        optionalMessage: reason,
      });

      const previewData =
        JSON.parse(sessionStorage.getItem("previewData")) || {};

      if (rejectionType === "Video") {
        await axios.put("/api/SupervisorDelete/RemoveVideoUrl", { studentId });

        await axios.put("/api/Status/SupVideoReview", {
          studentId,
          supervisorId,
          status: "rejected",
        });

        if (previewData?.videoPreviewData?.[0]) {
          previewData.videoPreviewData[0].videoUrl = null;
          sessionStorage.setItem("previewData", JSON.stringify(previewData));
        }

        setVideoPath(null);
      } else if (rejectionType === "Banner Image") {
        await axios.put("/api/SupervisorDelete/RemoveBannerImage", {
          studentId,
        });

        await axios.put("/api/Status/SupBannerReview", {
          studentId,
          supervisorId,
          status: "rejected",
        });

        if (previewData?.videoPreviewData?.[0]) {
          previewData.videoPreviewData[0].bannerImage = null;
          sessionStorage.setItem("previewData", JSON.stringify(previewData));
        }

        setBannerPath(null);
      }

      setIsModalOpen(false);
      setReason("");
      window.location.reload();
    } catch (error) {
      console.error("Error submitting rejection:", error);
    }
  };

  const handleApproval = async (type) => {
    try {
      if (type === "Video") {
        await axios.put("/api/Status/SupVideoReview", {
          studentId,
          supervisorId,
          status: "approved",
        });
        console.log("Video approved");
      } else if (type === "Banner Image") {
        await axios.put("/api/Status/SupBannerReview", {
          studentId,
          supervisorId,
          status: "approved",
        });
        console.log("Banner approved");
      }
      window.location.reload();
    } catch (error) {
      console.error("Error approving:", error);
    }
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
    const match = url.match(
      /(?:youtube\.com\/(?:.*[?&]v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="p-4 pb-24">
      <div className="max-w-2xl mx-auto p-4">
        <Link href="/supervisorportal/Review">
          <button className="border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white">
            Back
          </button>
        </Link>

        <h3 className="text-lg font-extrabold text-[#0069D9] text-center mt-4">
          Video Preview
        </h3>

        <div className="space-y-4 mt-4">
          {/* Video Section */}
          <div className="border-2 border-[#0069D9] p-6 rounded-lg">
            <label className="block font-bold mb-2 text-[#0069D9] text-base">
              Demo Video
            </label>
            {videoPath && getVideoId(videoPath) ? (
              <>
                <iframe
                  width="100%"
                  height="280"
                  src={`https://www.youtube.com/embed/${getVideoId(videoPath)}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <a
                  href={videoPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline block mt-2"
                >
                  Watch on YouTube
                </a>
              </>
            ) : (
              <p className="text-red-500 text-center">
                Video URL is not uploaded.
              </p>
            )}
          </div>

          {/* Video Approve/Reject Outside */}
          {!isVideoApproved && videoPath && getVideoId(videoPath) && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleApproval("Video")}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
                title="Approve Video"
              >
                ✅
              </button>
              <button
                onClick={() => openRejectionModal("Video")}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                title="Reject Video"
              >
                ❌
              </button>
            </div>
          )}

          {isVideoApproved && (
            <div className="text-green-500 text-center font-bold mt-4 text-lg">
              ✔️ Approved
            </div>
          )}

          {/* Banner Section */}
          <div className="border-2 border-[#0069D9] p-6 rounded-lg">
            <label className="block font-bold text-[#0069D9] text-base mb-2">
              Banner Image
            </label>
            {bannerPath ? (
              <>
                <Image
                  src={`/${bannerPath.replace(/^public\//, "")}`}
                  width={200}
                  height={200}
                  alt="Banner Image"
                  className="shadow-md rounded"
                />
                <button
                  onClick={handleDownload}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              </>
            ) : (
              <p className="text-red-500 text-center">
                Banner image is not uploaded.
              </p>
            )}
          </div>

          {/* Banner Approve/Reject Outside */}
          {!isBannerApproved && bannerPath && (
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => handleApproval("Banner Image")}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
                title="Approve Banner"
              >
                ✅
              </button>
              <button
                onClick={() => openRejectionModal("Banner Image")}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                title="Reject Banner"
              >
                ❌
              </button>
            </div>
          )}

          {isBannerApproved && (
            <div className="text-green-500 text-center font-bold mt-4 text-lg">
              ✔️ Approved
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex space-x-2 mb-4">
              <p className="bg-gray-300 p-2 rounded-full text-sm font-bold text-[#0069D9]">
                {rejectionType}
              </p>
              <p className="bg-gray-300 p-2 rounded-full text-sm font-bold text-[#0069D9] capitalize">
                {rollNumber}
              </p>
            </div>
            <h2 className="text-lg font-extrabold mb-2 text-[#0069D9]">
              Reason
            </h2>
            <form onSubmit={handleRejection}>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full border bg-gray-100 border-gray-500 rounded p-2 mb-4 text-black"
                rows={4}
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
