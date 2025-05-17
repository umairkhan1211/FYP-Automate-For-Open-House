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
  const [rejectionType, setRejectionType] = useState("");
  const [videoApproved, setVideoApproved] = useState(false);
  const [bannerApproved, setBannerApproved] = useState(false);
  const [activeType, setActiveType] = useState("video");

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
          fetch(`/api/Status/QaBannerSubmitStatus?rollNumber=${rollNumber}`),
        ]);

        const videoData = await videoRes.json();
        const bannerData = await bannerRes.json();

        setShowVideo(videoData.showContent);
        setShowBanner(bannerData.showContent);

        // Check checklist status separately for video and banner
        if (videoPath) {
          const videoChecklistRes = await fetch(
            `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=video`
          );
          const videoChecklistData = await videoChecklistRes.json();
          setVideoApproved(videoChecklistData?.rejectedPoints?.length === 0);
        }

        if (bannerPath) {
          const bannerChecklistRes = await fetch(
            `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=banner`
          );
          const bannerChecklistData = await bannerChecklistRes.json();
          setBannerApproved(bannerChecklistData?.rejectedPoints?.length === 0);
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    if (rollNumber) checkApprovalStatus();
  }, [rollNumber, type, videoPath, bannerPath]);

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

  return (
    <>
      {bothMissing ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="">
              <iframe
                src="https://lottie.host/embed/39f5bf97-43c8-49d9-bd42-2ed5c0339b5c/Y1JeqGKZsG.lottie"
                className="w-[200px] h-[200px] opacity-0 animate-fade-in mx-auto"
              ></iframe>
            </div>
            <div>
              <p className="text-red-500 text-base font-bold mt-4 capitalize">
                Video URL & Banner is not uploaded
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 pb-24">
          <div className="mx-auto p-1">
            <h3 className="text-base font-extrabold text-[#0069D9] text-center">
              Video Preview
            </h3>

            <div className="flex">
              {/* LEFT SIDE: Video + Banner */}
              <div className="w-8/12 mx-auto p-4 space-y-4">
                {/* Video Section */}
                <div className="border-2 border-[#0069D9] p-6 rounded-lg">
                  <label className="block font-bold mb-2 text-[#0069D9] text-base">
                    Demo Video
                  </label>
                  {videoPath && getVideoId(videoPath) ? (
                    showVideo ? (
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
                      <p className="text-red-500 text-center font-bold">
                        Video not approved by supervisor yet
                      </p>
                    )
                  ) : (
                    <p className="text-red-500 text-center font-bold">
                      Video URL is not uploaded
                    </p>
                  )}
                </div>

                {/* Banner Section */}
                <div className="border-2 border-[#0069D9] p-6 rounded-lg">
                  <label className="block font-bold text-[#0069D9] text-base mb-2">
                    Banner Image
                  </label>
                  {bannerPath ? (
                    showBanner ? (
                      <div>
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
                      </div>
                    ) : (
                      <p className="text-red-500 text-center font-bold">
                        Banner not approved by supervisor yet
                      </p>
                    )
                  ) : (
                    <p className="text-red-500 text-center font-bold">
                      Banner image is not uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: QA Checklist - Show relevant checklist based on type and path existence */}
              <div className="flex-2 w-[400px]">
                <div className="p-6 rounded-lg sticky top-4 h-[calc(100vh-32px)]">
                  {/* Show only one checklist at a time based on conditions */}
                  {videoPath ? (
                    <QAChecklist
                      type="video"
                      studentId={studentId}
                      supervisorId={supervisorId}
                      rollNumber={rollNumber}
                      Details={Details}
                      hasVideo={!!videoPath}
                      hasBanner={!!bannerPath}
                      alreadyApproved={videoApproved}
                    />
                  ) : bannerPath ? (
                    <QAChecklist
                      type="banner"
                      studentId={studentId}
                      supervisorId={supervisorId}
                      rollNumber={rollNumber}
                      Details={Details}
                      hasVideo={!!videoPath}
                      hasBanner={!!bannerPath}
                      alreadyApproved={bannerApproved}
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-red-500 font-bold">
                        No content available for QA checklist
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
