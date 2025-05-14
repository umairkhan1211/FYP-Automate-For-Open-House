import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function VideoPreview({ userId: initialUserId }) {
  const [bannerImagePath, setBannerImagePath] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [userId, setUserId] = useState(initialUserId || null); // Initialize with prop or null

  useEffect(() => {
    // Fetch userId from localStorage after component mounts
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        // Fetch video and banner image using the new API
        const response = await fetch(`/api/UploadFile/GetUploadedVideo?userId=${userId}`);
        const data = await response.json();
  
        if (response.ok) {
          const correctedPath = data.bannerImageFilePath?.startsWith("public/")
            ? data.bannerImageFilePath.replace("public/", "/")
            : data.bannerImageFilePath;
          setBannerImagePath(correctedPath);
          setVideoUrl(data.videoUrl);
        } else {
          console.error("Error fetching data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [userId]); // Fetch data only when userId is available
  
  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|(?:.*[?&]v=))|youtu\.be\/)([A-Za-z0-9_-]{11})/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  return (
    <div className="p-24">
      <div className="max-w-2xl mx-auto p-4 shadow-xl text-[#0069D9] rounded">
        <div className="space-y-4">
          <div className="border-2 border-[#0069D9] p-6">
            <label className="block font-semibold">Demo Video URL:</label>
            {videoUrl ? (
              <div className="space-y-2">
                {/* Embed the YouTube video */}
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
              <p className="text-red-500 text-center">No video uploaded.</p>
            )}
          </div>
          <div className="border-2 border-[#0069D9] p-6">
            <label className="block font-semibold">Banner Image:</label>
            {bannerImagePath ? (
              <Image
                src={bannerImagePath}
                width={200}
                height={200}
                alt="Banner Image"
                className="shadow-md p-2"
              />
            ) : (
              <p className="text-red-500 text-center">
                No banner image available.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end max-w-2xl mx-auto pt-4">
        <Link href="/studentportal">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Back
          </button>
        </Link>
      </div>
    </div>
  );
}
