import React, { useState } from "react";
import toast from "react-hot-toast";

export default function VideoUpload({ 
  userId, 
  rollNumber, 
  videoUrlExists: initialVideoUrlExists, 
  bannerImageExists: initialBannerImageExists 
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoUrlExists, setVideoUrlExists] = useState(initialVideoUrlExists);
  const [bannerImageExists, setBannerImageExists] = useState(initialBannerImageExists);

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoUrl) return;

    const loadingToast = toast.loading("Uploading video...");
    try {
      const formData = new FormData();
      formData.append("videoUrl", videoUrl);
      formData.append("fileType", "video");
      formData.append("userId", userId);
      formData.append("rollNumber", rollNumber);

      // Upload video
      const uploadRes = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Video upload failed");

      // Update status
      const statusRes = await fetch("/api/Status/VideoSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: userId, rollNumber }),
      });

      if (!statusRes.ok) throw new Error("Status update failed");

      // Notification cleanup if first upload
      if (!initialVideoUrlExists) {
        await fetch("/api/SupervisorDelete/RemoveVideoNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: userId, rollNumber }),
        });
      }

      setVideoUrlExists(true);
      toast.success("Video uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Video upload failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) return;

    const loadingToast = toast.loading("Uploading banner...");
    try {
      const formData = new FormData();
      formData.append("videoThumbnail", thumbnail);
      formData.append("fileType", "video");
      formData.append("userId", userId);
      formData.append("rollNumber", rollNumber);

      // Upload banner
      const uploadRes = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Banner upload failed");

      // Update status
      const statusRes = await fetch("/api/Status/BannerSubmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: userId, rollNumber }),
      });

      if (!statusRes.ok) throw new Error("Status update failed");

      // Notification cleanup if first upload
      if (!initialBannerImageExists) {
        await fetch("/api/SupervisorDelete/RemoveBannerNotification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: userId, rollNumber }),
        });
      }

      setBannerImageExists(true);
      toast.success("Banner uploaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Banner upload failed");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="p-6">
       <h2 className="font-extrabold text-base text-[#0069D9] p-4 text-center">
          VIDEO & BANNER IMAGE UPLOAD
        </h2>
      <div className="text-left mt-2">
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
                  onChange={(e) => setThumbnail(e.target.files[0] || null)}
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