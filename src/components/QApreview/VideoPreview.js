import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import QAChecklist from "../QAChecklist/QAChecklist";

export default function VideoPreview({
  data,
  projectTitle,
  supervisorId,
  userRole,
  Details,
  type,
}) {

  const [showVideo, setShowVideo] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [rejectionType, setRejectionType] = useState(""); // "Video" or "Banner Image"
  const [alreadyApproved, setAlreadyApproved] = useState(false);



  // Extract first student from the array
  const student = data.length > 0 ? data[0] : null;
  const studentId = student?._id || "";
  const rollNumber = student?.rollNumber || "";
  const videoPath = student?.videoUrl || "";
  const bannerPath = student?.bannerImage || "";
  
  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const [videoRes, bannerRes] = await Promise.all([
          fetch(`/api/Status/QaVideoSubmitStatus?rollNumber=${rollNumber}`),
          fetch(`/api/Status/QaBannerSubmitStatus?rollNumber=${rollNumber}`)
        ]);
        
        const videoData = await videoRes.json();
        const bannerData = await bannerRes.json();
        
        setShowVideo(videoData.showContent);
        setShowBanner(bannerData.showContent);
        
        // Check checklist status if needed
        if (type === 'video' && videoData.showContent) {
          const checklistRes = await fetch(
            `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=video`
          );
          const checklistData = await checklistRes.json();
          setAlreadyApproved(checklistData?.rejectedPoints?.length === 0);
        }
        else if (type === 'banner' && bannerData.showContent) {
          const checklistRes = await fetch(
            `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=banner`
          );
          const checklistData = await checklistRes.json();
          setAlreadyApproved(checklistData?.rejectedPoints?.length === 0);
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    if (rollNumber) checkApprovalStatus();
  }, [rollNumber, type]);

  const handleDownload = () => {
    const imagePath = bannerPath.replace(/^public\//, "");
    const downloadUrl = `/api/FetchRecords/GetBannerdownload?imagePath=${encodeURIComponent(
      imagePath
    )}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.click();
  };

  const getVideoId = (url) => {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|(?:\S+?[?&]v=))|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const bothMissing = !videoPath && !bannerPath;

    const hasVideoContent = videoPath && getVideoId(videoPath);
  const hasBannerContent = bannerPath;

 const displayType = hasVideoContent && hasBannerContent ? type : 
                    hasBannerContent ? 'banner' : 
                    hasVideoContent ? 'video' : null;

  return (
    <div className="p-3 pb-24">
      <div className="mx-auto p-1">
        <h3 className="text-base font-extrabold text-[#0069D9] text-center">
          Video Preview
        </h3>

        <div
          className={`mt-4 ${
            bothMissing ? "flex justify-center" : "flex "
          }`}
        >
          {/* LEFT SIDE: Video + Banner */}
          <div
            className={`${
              bothMissing ? "w-full max-w-2xl" : "w-8/12"
            } mx-auto p-4 space-y-4`}
          >
            {/* Video Section */}
            <div className="border-2 border-[#0069D9] p-6 rounded-lg">
              <label className="block font-bold mb-2 text-[#0069D9] text-base">
                Demo Video
              </label>
              {showVideo && videoPath && getVideoId(videoPath) ? (
                <div className="space-y-2">
                  <div className="p-2">
                    <iframe
                      width="100%"
                      height="280"
                      src={`https://www.youtube.com/embed/${getVideoId(
                        videoPath
                      )}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <a
                    href={videoPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              ) : (
                <p className="text-red-500 text-center">
                   {showVideo ? "Video URL is not uploaded" : "Video not approved by supervisor yet"}
                </p>
              )}
            </div>

            {/* Banner Section */}
            <div className="border-2 border-[#0069D9] p-6 rounded-lg">
              <label className="block font-bold text-[#0069D9] text-base mb-2">
                Banner Image
              </label>
              {showBanner && bannerPath ? (
                <div>
                  <Image
                    src={`/${bannerPath.replace(/^public\//, "")}`}
                    width={200}
                    height={200}
                    alt="Banner Image"
                    className="shadow-md rounded"
                  />
                </div>
              ) : (
                <p className="text-red-500 text-center">
                 {showBanner ? "Banner image is not uploaded" : "Banner not approved by supervisor yet"}
                </p>
              )}
              {bannerPath && (
                <button
                  onClick={handleDownload}
                  className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
                >
                  Download
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: QA Checklist - Sticky */}
          {((type === 'video' && showVideo) || (type === 'banner' && showBanner)) &&  (
            <div className="flex-2 w-[400px]">
              <div className="p-6 rounded-lg sticky top-4 h-[calc(100vh-32px)]">
                <QAChecklist
                type={displayType}
                  studentId={studentId}
                  supervisorId={supervisorId}
                  rollNumber={rollNumber}
                  Details={Details}
                  hasVideo={!!videoPath}
                  hasBanner={!!bannerPath}
                  alreadyApproved={alreadyApproved}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
