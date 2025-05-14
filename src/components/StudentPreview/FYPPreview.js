import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function FYPPreview() {
  const [fypDocumentPath, setFypDocumentPath] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
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
        const response = await fetch(`/api/UploadFile/GetUploadedFYP?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setFypDocumentPath(data.fypDocumentPath);
        } else {
          console.error("Error fetching FYP document:", data.message);
        }
      } catch (error) {
        console.error("Error fetching FYP document:", error);
      }
    };
    fetchData();
  }, [userId]);

  const handleDownload = async () => {
    if (!fypDocumentPath) return;

    const response = await fetch(fypDocumentPath);
    try {
      if (!response.ok) {
        console.error("File not found.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const fileName = fypDocumentPath.split("/").pop();
      a.download = fileName || "FYP_Document.docx";

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading FYP document:", error);
    }
  };

  return (
    <div className="p-20">
      <div className="max-w-2xl mx-auto p-4 bg-white shadow-2xl border-2 border-[#0069D9] rounded-lg text-gray-700">
        <h3 className="text-lg font-semibold">FYP Document:</h3>
        {fypDocumentPath ? (
          <button onClick={handleDownload} className="text-blue-500 hover:underline">
            Download FYP Document
          </button>
        ) : (
          <p className="text-gray-700">No document uploaded.</p>
        )}
        <br />
        <Link href="/studentportal">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Back</button>
        </Link>
      </div>
    </div>
  );
}
