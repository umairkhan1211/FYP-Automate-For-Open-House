import axios from "axios";
import React, { useEffect, useState } from "react";

function QAChecklist({ 
  type, 
  Details, 
  studentId, 
  supervisorId, 
  rollNumber,
  hasVideo,
  hasBanner 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [activeType, setActiveType] = useState(type);

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
              accepted: actionType === "accept",
              rejected: actionType === "reject",
            }
          : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rejectedPoints = checklist
      .filter((item) => item.rejected)
      .map((item) => item.parameter);

    const finalType = hasVideo && hasBanner ? activeType : type;

    const data = {
      ...Details,
      studentId,
      supervisorId,
      rollNumber,
      type: finalType,
      rejectedPoints,
      optionalMessage: reason,
    };

    console.log("Submit Data:", data);

    try {
      // 1. Send the Notification
      const response = await fetch("/api/Notification/Notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Notification saved successfully");

        // 2. Conditionally remove the respective type based on rejection
        if (rejectedPoints.length > 0) {
          if (finalType === "cv") {
            await axios.put("/api/SupervisorDelete/RemoveCV", { studentId });
            console.log("CV removed successfully");
          } else if (finalType === "fyp") {
            await axios.put("/api/SupervisorDelete/RemoveFYP", { studentId });
            console.log("FYP removed successfully");
          } else if (finalType === "video") {
            await axios.put("/api/SupervisorDelete/RemoveVideoUrl", { studentId });
            console.log("Video removed successfully");
          } else if (finalType === "banner") {
            await axios.put("/api/SupervisorDelete/RemoveBannerImage", { studentId });
            console.log("Banner removed successfully");
          }
        }

        // 3. Reload page
        window.location.reload();
      } else {
        console.error("Failed to save notification");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setIsModalOpen(false);
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
            ? activeType === "video" ? "Video" : "Banner"
            : type === "video" ? "Video" : "Banner"}
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
          >
            Video
          </button>
          <button
            onClick={() => setActiveType("banner")}
            className={`p-2 rounded-lg text-[#0069D9] text-sm font-bold ${
              activeType === "banner" ? "bg-[#0069D9] text-white" : "bg-gray-300"
            }`}
          >
            Banner
          </button>
        </div>
      )}

      <ul>
        {checklist.map((item) => (
          <li key={item.id} className="mb-4">
            <p className="text-black text-sm">{item.parameter}</p>
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
          </li>
        ))}
      </ul>

      <button
        className="mt-4 border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-white bg-[#0069D9] hover:bg-white hover:text-[#0069D9] hover:border-[#0069D9] focus:outline-none focus:shadow-outline disabled:opacity-50"
        disabled={!checklist.every((item) => item.accepted || item.rejected)}
        onClick={() => setIsModalOpen(true)}
      >
        Submit
      </button>

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