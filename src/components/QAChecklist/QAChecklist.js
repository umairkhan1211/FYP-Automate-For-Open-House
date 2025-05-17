import axios from "axios";
import React, { useEffect, useState } from "react";

function QAChecklist({
  type,
  Details,
  studentId,
  supervisorId,
  rollNumber,
  hasVideo,
  hasBanner,
  alreadyApproved,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [activeType, setActiveType] = useState(type);
  // Inside QAChecklist component
  const [localApproved, setLocalApproved] = useState(alreadyApproved);

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const res = await fetch(
          `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=${activeType}`
        );
        const data = await res.json();
        setLocalApproved(data && data.rejectedPoints?.length === 0);
      } catch (error) {
        console.error("Error checking approval status:", error);
        setLocalApproved(false);
      }
    };

    if (hasVideo && hasBanner) {
      checkApprovalStatus();
    } else {
      setLocalApproved(alreadyApproved);
    }
  }, [activeType, rollNumber, hasVideo, hasBanner, alreadyApproved]);

  useEffect(() => {
    // Only allow toggling if both video and banner are available
    if (hasVideo && hasBanner) {
      setChecklist(getChecklist(activeType));
    } else {
      // Otherwise use the passed type
      setChecklist(getChecklist(type));
    }
  }, [activeType, type, hasVideo, hasBanner]);

  function getChecklist(type) {
    switch (type) {
      case "cv":
        return [
          {
            id: 1,
            parameter: "CV should match the given template",
            accepted: false,
            rejected: false,
          },
          {
            id: 2,
            parameter: "Skills should be mentioned in CV",
            accepted: false,
            rejected: false,
          },
          {
            id: 3,
            parameter: "Alignment or Formatting",
            accepted: false,
            rejected: false,
          },
          {
            id: 4,
            parameter: "Content should be precise in CV",
            accepted: false,
            rejected: false,
          },
        ];
      case "fyp":
        return [
          {
            id: 1,
            parameter: "FYP document should follow the provided template",
            accepted: false,
            rejected: false,
          },
          {
            id: 2,
            parameter: "FYP should have clear objective/problem statement",
            accepted: false,
            rejected: false,
          },
          {
            id: 3,
            parameter: "Proper formatting and citations",
            accepted: false,
            rejected: false,
          },
          {
            id: 4,
            parameter: "Summary and conclusion sections included",
            accepted: false,
            rejected: false,
          },
        ];
      case "video":
        return [
          {
            id: 1,
            parameter: "Video should match the given resolution",
            accepted: false,
            rejected: false,
          },
          {
            id: 2,
            parameter: "Audio should be clear and understandable",
            accepted: false,
            rejected: false,
          },
          {
            id: 3,
            parameter: "Proper demonstration of the system",
            accepted: false,
            rejected: false,
          },
          {
            id: 4,
            parameter: "No background noise or interruptions",
            accepted: false,
            rejected: false,
          },
        ];
      case "banner":
        return [
          {
            id: 1,
            parameter: "Banner should have good resolution",
            accepted: false,
            rejected: false,
          },
          {
            id: 2,
            parameter: "Project title should be clearly visible",
            accepted: false,
            rejected: false,
          },
          {
            id: 3,
            parameter: "Color scheme should be professional",
            accepted: false,
            rejected: false,
          },
          {
            id: 4,
            parameter: "Image should not be blurry or pixelated",
            accepted: false,
            rejected: false,
          },
        ];
      default:
        return [];
    }
  }

  const handleCheckboxChange = (id, actionType) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              accepted: actionType === "accept" ? true : false,
              rejected: actionType === "reject" ? true : false,
            }
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const approvedPoints = checklist
      .filter((item) => item.accepted)
      .map((item) => item.parameter);

    const rejectedPoints = checklist
      .filter((item) => item.rejected)
      .map((item) => item.parameter);

    // Determine the final type to use
    let finalType;
    if (hasVideo && hasBanner) {
      finalType = activeType;
    } else {
      finalType = type;
    }

    const checklistdata = {
      studentId,
      qaId: Details?.userId,
      qaName: Details?.userName,
      rollNumber,
      type: finalType,
      rejectedPoints,
      approvedPoints,
      optionalMessage: reason,
    };

    // Build status update object with qaId and qaName
    let statusUpdate = {
      studentId,
      qaId: Details?.userId,
      qaName: Details?.userName, // Add qaName to be saved in status
    };

    const isRejected = rejectedPoints.length > 0;

    // Determine which API endpoint to call based on type
    let apiEndpoint = "";
    if (finalType === "cv") {
      statusUpdate.cvStatus = isRejected ? "rejected" : "approved";
      statusUpdate.supervisorCvReview = isRejected ? "rejected" : "approved";
      statusUpdate.qaCvReview = isRejected ? "rejected" : "approved";
      apiEndpoint = "/api/Status/QaCvReview";
    } else if (finalType === "fyp") {
      statusUpdate.fypStatus = isRejected ? "rejected" : "approved";
      statusUpdate.supervisorFypReview = isRejected ? "rejected" : "approved";
      statusUpdate.qaFypReview = isRejected ? "rejected" : "approved";
      apiEndpoint = "/api/Status/QaFypReview";
    } else if (finalType === "video") {
      statusUpdate.videoStatus = isRejected ? "rejected" : "approved";
      statusUpdate.supervisorVideoReview = isRejected ? "rejected" : "approved";
      statusUpdate.qaVideoReview = isRejected ? "rejected" : "approved";
      apiEndpoint = "/api/Status/QaVideoReview";
    } else if (finalType === "banner") {
      statusUpdate.bannerStatus = isRejected ? "rejected" : "approved";
      statusUpdate.supervisorBannerReview = isRejected
        ? "rejected"
        : "approved";
      statusUpdate.qaBannerReview = isRejected ? "rejected" : "approved";
      apiEndpoint = "/api/Status/QaBannerReview";
    }

    try {
      // First update the status
      const reviewRes = await fetch(apiEndpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusUpdate),
      });

      if (!reviewRes.ok) {
        const error = await reviewRes.json();
        throw new Error(error.message || "Failed to update status");
      }

      // Then create the checklist
      const checklistRes = await fetch("/api/Checklist/Checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checklistdata),
      });

      if (!checklistRes.ok) {
        const error = await checklistRes.json();
        throw new Error(error.message || "Failed to create checklist");
      }

      // Handle notification if rejected
      if (rejectedPoints.length > 0) {
        const notificationData = {
          ...Details,
          studentId,
          supervisorId,
          rollNumber,
          type: finalType,
          rejectedPoints,
          optionalMessage: reason,
        };

        await fetch("/api/Notification/Notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationData),
        });

        // Remove the rejected item
        const removalEndpoints = {
          cv: "/api/SupervisorDelete/RemoveCV",
          fyp: "/api/SupervisorDelete/RemoveFYP",
          video: "/api/SupervisorDelete/RemoveVideoUrl",
          banner: "/api/SupervisorDelete/RemoveBannerImage",
        };

        if (removalEndpoints[finalType]) {
          await axios.put(removalEndpoints[finalType], { studentId });
        }
      }

      window.location.reload();
    } catch (err) {
      console.error("Submission error:", err);
      alert(err.message || "An error occurred during submission");
    }
  };
  return (
    <div className="flex-1 sticky top-0 p-5 border-l-2 border-[#0069D9]">
      <div className="flex mb-4">
        <img
          src="/delivery.gif"
          alt="Loading Animation"
          className="w-[75px] h-[75px] opacity-0 animate-fade-in"
        />
        <p className="text-[#0069D9] text-xl my-5 font-extrabold">
          Checklist (
          {hasVideo && hasBanner
            ? activeType.charAt(0).toUpperCase() + activeType.slice(1)
            : type.charAt(0).toUpperCase() + type.slice(1)}
          )
        </p>
      </div>

      {/* Show toggle buttons only if both video and banner are available */}
      {hasVideo && hasBanner && (
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveType("video")}
            className={`p-2 rounded-lg text-[#0069D9] text-sm font-bold ${
              activeType === "video" ? "bg-[#0069D9] text-white" : "bg-gray-300"
            }`}
            disabled={!hasVideo} // Disable if no video
          >
            Video
          </button>
          <button
            onClick={() => setActiveType("banner")}
            className={`p-2 rounded-lg text-[#0069D9] text-sm font-bold ${
              activeType === "banner"
                ? "bg-[#0069D9] text-white"
                : "bg-gray-300"
            }`}
            disabled={!hasBanner} // Disable if no banner
          >
            Banner
          </button>
        </div>
      )}

      <ul>
        {checklist.map((item) => (
          <li key={item.id} className="mb-4">
            <p className="text-black text-sm">{item.parameter}</p>
            {!localApproved && (
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <label>
                  <input
                    type="checkbox"
                    checked={item.accepted}
                    onChange={() => handleCheckboxChange(item.id, "accept")}
                  />
                  Accept
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={item.rejected}
                    onChange={() => handleCheckboxChange(item.id, "reject")}
                  />
                  Reject
                </label>
              </div>
            )}
          </li>
        ))}
      </ul>
      {localApproved ? (
        <button
          className="mt-4 border-2 rounded-lg text-md font-semibold py-1 px-4 border-green-600 text-white bg-green-600"
          disabled
        >
          Approved
        </button>
      ) : (
        <button
          className="mt-4 border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-white bg-[#0069D9] hover:bg-white hover:text-[#0069D9] hover:border-[#0069D9] focus:outline-none focus:shadow-outline disabled:opacity-50"
          disabled={!checklist.every((item) => item.accepted || item.rejected)}
          onClick={() => setIsModalOpen(true)}
        >
          Submit
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-[#0069D9] text-xl font-semibold mb-4">
              Reason
            </h2>
            <div className="mb-4">
              <h3 className="text-black text-base font-semibold">
                Rejected Points:
              </h3>
              <ul className="list-disc list-inside">
                {checklist
                  .filter((item) => item.rejected)
                  .map((item) => (
                    <li key={item.id} className="text-base text-red-500">
                      {item.parameter}
                    </li>
                  ))}
              </ul>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="shadow appearance-none border italic text-sm rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="(Optional)"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

export default QAChecklist;
