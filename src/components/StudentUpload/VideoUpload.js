import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function VideoUpload({ userId, rollNumber }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const [videoUrlExists, setVideoUrlExists] = useState(false);
  const [bannerImageExists, setBannerImageExists] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  console.log(userId, rollNumber);

  useEffect(() => {
    const checkStatus = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `/api/UploadFile/CheckVideoStatus?userId=${encodeURIComponent(
            userId
          )}`
        );

        const data = await response.json();

        if (response.ok) {
          setVideoUrlExists(data.videoUrlExists);
          setBannerImageExists(data.bannerImageExists);
        } else {
          console.error("Error checking status:", data.message);
        }
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setStatusChecked(true);
      }
    };

    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading...");

    try {
      const formData = new FormData();
      formData.append("videoUrl", videoUrl);
      formData.append("videoThumbnail", thumbnail);
      formData.append("fileType", "video");
      formData.append("userId", userId);
      formData.append("rollNumber", rollNumber);

      const response = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setIsSubmitted(true);

        // ✅ Trigger API deletion calls for notifications
        const deleteVideoNotification = fetch(
          "/api/SupervisorDelete/RemoveVideoNotification",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: userId, rollNumber }),
          }
        );

        const deleteBannerNotification = fetch(
          "/api/SupervisorDelete/RemoveBannerNotification",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: userId, rollNumber }),
          }
        );

        // ✅ Wait for both delete API responses
        const [videoRes, bannerRes] = await Promise.all([
          deleteVideoNotification,
          deleteBannerNotification,
        ]);

        const videoData = await videoRes.json();
        const bannerData = await bannerRes.json();

        if (videoRes.ok) {
          console.log("Video Notification Deleted:", videoData.message);
        } else {
          console.warn("Video Notification Delete Failed:", videoData.message);
        }

        if (bannerRes.ok) {
          console.log("Banner Notification Deleted:", bannerData.message);
        } else {
          console.warn(
            "Banner Notification Delete Failed:",
            bannerData.message
          );
        }
      } else {
        toast.error(data.error || "Upload failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Upload error:", error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const isFormValid = () => videoUrl && thumbnail;

  if (!statusChecked) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10">
      <div className="p-16 text-left">
        <div className="max-w-2xl mx-auto p-6 border-2 border-[#0069D9] rounded text-[#0069D9]">
          {videoUrlExists ? (
            <label className="flex justify-evenly p-2">
              <strong>Demo Video URL:</strong>
              <i className="bi bi-check-circle-fill text-green-600 text-2xl"></i>
              <p className="text-green-500 font-semibold">Uploaded</p>
            </label>
          ) : (
            <div className="space-y-2">
              <label className="block">
                <strong>Demo Video URL:</strong>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-black"
                placeholder="https://www.youtube.com/watch?v=example"
                required
                disabled={isSubmitted} // Disable if submitted
              />
            </div>
          )}

          {bannerImageExists ? (
            <label className="flex justify-evenly p-2">
              <strong>Banner Image:</strong>
              <i className="bi bi-check-circle-fill text-green-600 text-2xl"></i>
              <p className="text-green-500 font-semibold">Uploaded</p>
            </label>
          ) : (
            <div className="space-y-2">
              <label className="block">
                <strong>Banner Image:</strong>
              </label>
              <input
                type="file"
                accept=".jpg"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setThumbnail(file);
                    toast.success("File uploaded successfully!");
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={isSubmitted} // Disable if submitted
              />
            </div>
          )}

          {!videoUrlExists && !bannerImageExists && (
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!isFormValid() || isSubmitted} // Disable if form is invalid or submitted
                onClick={handleSubmit}
              >
                {isSubmitted ? "Submitted" : "Submit"}{" "}
                {/* Change text if submitted */}
              </button>
              <Link href="/studentportal">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
