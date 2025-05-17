import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function FYPPreview({
  fypDocument,
  studentId,
  rollNumber,
  supervisorId,
  supervisorRole,
  projectTitle,
}) {
  console.log(
    "fyp preview ma supvisor id or role dekho ",
    supervisorId,
    supervisorRole
  );
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [fypPath, setFypPath] = useState(fypDocument); // local state for FYP path
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    if (!studentId || !supervisorId) return; // guard clause

    const fetchCvStatus = async () => {
      try {
        const response = await axios.get("/api/Status/SupFYPSubmitStatus", {
          params: { studentId, supervisorId },
        });
        if (response.data?.supervisorFypReview === "approved") {
          setIsApproved(true);
        }
      } catch (error) {
        console.error("Error fetching FYP status:", error);
      }
    };

    fetchCvStatus();
  }, [studentId, supervisorId]);

  // Sync state when prop changes (e.g., after navigation)
  useEffect(() => {
    setFypPath(fypDocument);
  }, [fypDocument]);

  // Handle approval or rejection
  const handleApproval = async () => {
    try {
      // 1. Update the supervisorCvReview status to 'Approved'
      const response = await axios.put("/api/Status/SupFYPReview", {
        studentId,
        supervisorId,
        status: "approved",
      });

      if (response?.supervisorCvReview === "approved") {
        setIsApproved(true);
      }

      console.log("Supervisor FYP status updated to Approved");
      setIsApproved(true); // Set to true when approved
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  const handleRejection = async (e) => {
    e.preventDefault();

    try {
      // 1. Send rejection notification
      await axios.post("/api/Notification/SupervisorNotification", {
        studentId,
        supervisorId,
        userRole: supervisorRole,
        rollNumber,
        type: "fyp",
        optionalMessage: reason,
      });

      // 2. Remove CV path from Upload model
      await axios.put("/api/SupervisorDelete/RemoveFYP", {
        studentId,
      });

      // Step 1: Get previewData from sessionStorage
      const previewData = JSON.parse(sessionStorage.getItem("previewData"));

      // Step 2: Check and nullify fypDocument
      if (
        previewData &&
        previewData.fypPreviewData &&
        previewData.fypPreviewData.length > 0
      ) {
        previewData.fypPreviewData[0].fypDocument = null;

        // Step 3: Save back updated data to sessionStorage
        sessionStorage.setItem("previewData", JSON.stringify(previewData));

        console.log("Updated previewData:", previewData); // for debugging
      }

      // 3. Update the supervisorCvReview status to 'Rejected'
      await axios.put("/api/Status/SupFYPReview", {
        studentId,
        supervisorId,
        status: "rejected",
      });

      console.log(
        "Notification sent, FYP path removed, and status updated to Rejected"
      );

      window.location.reload(); // Refresh the page after rejection
    } catch (error) {
      console.error("Error submitting rejection:", error);
    }

    setIsModalOpen(false);
    setReason("");
  };

  const handleDownload = async () => {
    if (!fypPath) {
      console.error("FYP document not uploaded.");
      return;
    }

    try {
      const response = await axios.get(
        `/api/FetchRecords/GetFYPdownload?filePath=${encodeURIComponent(
          fypPath.replace(/^public\//, "")
        )}`,
        { responseType: "blob" }
      );

      const filename = fypPath.split("/").pop() || "FYP_Document.pdf";
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="p-4 pb-24">
      <h2 className="text-[#0069D9] text-center text-lg font-extrabold mb-2">
        FYP PREVIEW
      </h2>

      {!fypPath ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="">
              <iframe
                src="https://lottie.host/embed/0f81bb96-9e62-45af-bc62-e1817447056c/mslEqpcA5P.lottie"
                className="w-[180px] h-[180px] opacity-0 animate-fade-in mx-auto"
              ></iframe>
            </div>
            <p className="text-red-500 text-center font-bold text-base mt-6 capitalize ">
              FYP document is not uploaded
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-gray-100 rounded-lg p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#0069D9]">
              Click the download button to preview the document
            </h3>

            <button
              onClick={handleDownload}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Download
            </button>
          </div>

          {!isApproved && (
            <div className="flex justify-end p-6 space-x-4 mx-auto w-6/11">
              <button
                onClick={handleApproval}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600"
                title="Approve"
              >
                ✔️
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600"
                title="Reject"
              >
                ❌
              </button>
            </div>
          )}

          {isApproved && (
            <div className="text-green-500 text-center font-bold mt-4 text-lg">
              ✔️ Approved
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-200 p-6 rounded-lg max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-700 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex space-x-2">
              <div className="">
                <p className="mb-2 text-[#0069D9] bg-gray-300 rounded-full p-2 text-sm font-bold">
                  Fyp
                </p>
              </div>
              <div>
                <p className="mb-4 text-[#0069D9] bg-gray-300 rounded-full p-2 text-sm font-bold capitalize">
                  {rollNumber}
                </p>
              </div>
            </div>
            <h2 className="text-lg font-extrabold mb-4 text-[#0069D9]">
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
