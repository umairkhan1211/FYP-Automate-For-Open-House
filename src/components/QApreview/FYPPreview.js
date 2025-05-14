import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import QAChecklist from "../QAChecklist/QAChecklist";

export default function FYPPreview({
  data = [],
  projectTitle,
  supervisorId,
  userRole,
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract first student from the array
  const student = data.length > 0 ? data[0] : null;
  const studentId = student?._id || "";
  const rollNumber = student?.rollNumber || "";
  const fypPath = student?.fypDocument || "";

  useEffect(() => {
    console.log("Student Data:", student);
    console.log("FYP Path:", fypPath);
  }, [student]);

  const handleReject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        studentId,
        rollNumber,
        supervisorId,
        userRole,
        optionalMessage: reason,
        type: "fyp",
      };

      const response = await axios.post(
        "/api/Notification/FYPNotification",
        payload
      );

      if (response.status === 201) {
        await axios.put("/api/SupervisorDelete/RemoveFYP", { studentId });
        setIsModalOpen(false);
        setReason("");
      } else {
        console.error("Notification failed:", response.data.message);
      }
    } catch (error) {
      console.error("Reject Error:", error.response || error);
    }
  };

  const handleDownload = async () => {
    if (!fypPath) {
      console.error("No FYP document found.");
      return;
    }

    try {
      const filePath = fypPath.replace(/^public\//, "");
      const response = await axios.get(
        `/api/FetchRecords/GetFYPdownload?filePath=${encodeURIComponent(
          filePath
        )}`,
        {
          responseType: "blob",
        }
      );

      const filename = fypPath.split("/").pop();
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", filename || "FYP_Document.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="p-4">
      
      <h2 className="text-[#0069D9] text-center text-lg font-extrabold mb-4 mt-6">
        FYP PREVIEW
      </h2>
      <div className="flex items-center">
        <div className="w-7/12 mx-auto p-4 ">
          <div className="bg-gray-100 border-2 border-[#0069D9] rounded-lg p-6 space-y-4">
            <h3 className="text-base font-semibold text-[#0069D9]">
              {fypPath
                ? "Click download to preview the FYP document."
                : "No FYP document uploaded."}
            </h3>

            {fypPath && (
              <button
                onClick={handleDownload}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
              >
                Download
              </button>
            )}
          </div>
        </div>
        <div className="flex-2">
          <QAChecklist
           type="fyp"
            studentId={studentId}
            supervisorId={supervisorId}
            rollNumber={rollNumber}
          />
        </div>
      </div>
    </div>
  );
}
