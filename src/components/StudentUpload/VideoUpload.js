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
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    const checkStatus = async () => {
      if (!userId) return;

      try {
        const response = await fetch(
          `/api/UploadFile/CheckVideoStatus?userId=${encodeURIComponent(userId)}`
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
        setStatusChecked(true); // Set status to checked after the operation completes
      }
    };

    checkStatus();
  }, [userId]);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading video...");

    try {
      // Step 1: Upload Video
      const formData = new FormData();
      formData.append("videoUrl", videoUrl);
      formData.append("fileType", "video");
      formData.append("userId", userId);
      formData.append("rollNumber", rollNumber);

      const response = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      // Step 2: Submit Video Status Update
      const submitRes = await fetch("/api/Status/VideoSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          rollNumber,
        }),
      });

      const submitData = await submitRes.json();
      if (!submitRes.ok) {
        throw new Error(submitData.message || "Failed to update Video status");
      }
     

      setIsSubmitted(true);
      setUploadMessage("FYP document submitted successfully");

      // Step 3: Handle Video Upload Response
      const data = await response.json();
      if (response.ok) {
        toast.success("Video uploaded!");

        // Only hit notification delete if videoUrl wasn't already uploaded
        if (!videoUrlExists) {
          const deleteVideoNotification = await fetch("/api/SupervisorDelete/RemoveVideoNotification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: userId, rollNumber }),
          });

          const videoData = await deleteVideoNotification.json();
          if (deleteVideoNotification.ok) {
            console.log("Video Notification Deleted:", videoData.message);
          } else {
            console.warn("Video Notification Delete Failed:", videoData.message);
          }
        }

        setVideoUrlExists(true); // Update state after success
      } else {
        toast.error(data.error || "Video upload failed!");
      }
    } catch (error) {
      toast.error("Error uploading video.");
      console.error(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading banner...");

    try {
      // Step 1: Upload Banner
      const formData = new FormData();
      formData.append("videoThumbnail", thumbnail);
      formData.append("fileType", "video");
      formData.append("userId", userId);
      formData.append("rollNumber", rollNumber);

      const response = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      // Step 2: Submit Banner Status Update
     
      const submitRes = await fetch("/api/Status/BannerSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: userId,
          rollNumber,
        }),
      });

      const submitData = await submitRes.json();
      if (!submitRes.ok) {
        throw new Error(submitData.message || "Failed to update Banner status");
      }
    

      setIsSubmitted(true);
      setUploadMessage("FYP document submitted successfully");

      // Step 3: Handle Banner Upload Response
      const data = await response.json();
      if (response.ok) {
        toast.success("Banner uploaded!");

        // Only hit banner delete API if not already uploaded
        if (!bannerImageExists) {
          const deleteBannerNotification = await fetch("/api/SupervisorDelete/RemoveBannerNotification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: userId, rollNumber }),
          });

          const bannerData = await deleteBannerNotification.json();
          if (deleteBannerNotification.ok) {
            console.log("Banner Notification Deleted:", bannerData.message);
          } else {
            console.warn("Banner Notification Delete Failed:", bannerData.message);
          }
        }

        setBannerImageExists(true); // Update state after success
      } else {
        toast.error(data.error || "Banner upload failed!");
      }
    } catch (error) {
      toast.error("Error uploading banner.");
      console.error(error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  if (!statusChecked) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <div className="p-16 text-left">
        <div className="max-w-2xl mx-auto p-6 border-2 border-[#0069D9] rounded text-[#0069D9] space-y-6">
          {/* Video Upload Section */}
          <div>
            <label className="block mb-2 font-semibold">Demo Video URL</label>
            {videoUrlExists ? (
              <p className="text-green-600 flex items-center space-x-2">
                <i className="bi bi-check-circle-fill text-2xl"></i>
                <span>Video already uploaded</span>
              </p>
            ) : (
              <>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black mb-2"
                  placeholder="https://www.youtube.com/watch?v=example"
                  required
                />
                <button
                  onClick={handleVideoSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!videoUrl}
                >
                  Upload Video
                </button>
              </>
            )}
          </div>

          {/* Banner Upload Section */}
          <div>
            <label className="block mb-2 font-semibold">Banner Image (.jpg)</label>
            {bannerImageExists ? (
              <p className="text-green-600 flex items-center space-x-2">
                <i className="bi bi-check-circle-fill text-2xl"></i>
                <span>Banner already uploaded</span>
              </p>
            ) : (
              <>
                <input
                  type="file"
                  accept=".jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setThumbnail(file);
                      toast.success("Image selected!");
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button
                  onClick={handleBannerSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!thumbnail}
                >
                  Upload Banner
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
