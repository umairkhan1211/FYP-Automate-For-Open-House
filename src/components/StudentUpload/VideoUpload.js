import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function VideoUpload() {
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Uploading..."); // Show loading toast

    try {
      const formData = new FormData();
      formData.append("videoUrl", videoUrl);
      formData.append("videoThumbnail", thumbnail); 
      formData.append("fileType", "video");
      formData.append("userId", localStorage.getItem("userId"));

      const response = await fetch("/api/UploadFile/Upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("File uploaded successfully!");
      } else {
        toast.error(data.error || "Upload failed!");
      }

      console.log(data);
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Upload error:", error);
    } finally {
      toast.dismiss(loadingToast); // Remove loading toast
    }
  };

  const isFormValid = () => videoUrl && thumbnail;

  return (
    <div className="p-10">
      <div className="p-16 text-left">
        <div className="max-w-2xl mx-auto p-6 border-2 border-[#0069D9] rounded text-[#0069D9]">
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <div className="space-y-2 ">
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
              />
            </div>
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
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!isFormValid()}
              >
                Submit
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
          </form>
        </div>
      </div>
    </div>
  );
}
