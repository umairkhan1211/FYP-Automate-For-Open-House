import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import QAChecklist from "../QAChecklist/QAChecklist";

export default function FYPPreview({
  data = [],
  Details,
  projectTitle,
  supervisorId,
  userRole,
  type,
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyApproved, setAlreadyApproved] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const student = data.length > 0 ? data[0] : null;
  const studentId = student?._id || "";
  const rollNumber = student?.rollNumber || "";
  const fypPath = student?.fypDocument || "";

  useEffect(() => {
    const checkApprovalStatus = async () => {
      try {
        const res = await fetch(
          `/api/Status/QaFypSubmitStatus?rollNumber=${rollNumber}`
        );
        const data = await res.json();

        if (res.ok) {
          setShowContent(data.showContent);

          if (data.showContent) {
            const checklistRes = await fetch(
              `/api/Checklist/GetChecklistStatus?rollNumber=${rollNumber}&type=${type}`
            );
            const checklistData = await checklistRes.json();
            setAlreadyApproved(checklistData?.rejectedPoints?.length === 0);
          }
        }
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    if (rollNumber) checkApprovalStatus();
  }, [rollNumber, type]);

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
      <h2 className="text-[#0069D9] text-center text-base font-extrabold mb-4">
        FYP PREVIEW
      </h2>
      <div className="flex justify-between items-start">
        <div className="w-7/12 mx-auto p-4">
          {showContent ? (
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
          ) : (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="">
                  <iframe
                    src="https://lottie.host/embed/0f81bb96-9e62-45af-bc62-e1817447056c/mslEqpcA5P.lottie"
                    className="w-[180px] h-[180px] opacity-0 animate-fade-in mx-auto"
                  ></iframe>
                </div>
                <div>
                  <p className="text-red-500 font-bold mt-6 capitalize">
                    FYP not approved by supervisor yet
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex-2">
          {showContent && fypPath && (
            <QAChecklist
              type="fyp"
              studentId={studentId}
              supervisorId={supervisorId}
              rollNumber={rollNumber}
              Details={Details}
              alreadyApproved={alreadyApproved}
            />
          )}
        </div>
      </div>
    </div>
  );
}
