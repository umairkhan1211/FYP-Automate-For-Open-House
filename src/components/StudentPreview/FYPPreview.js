import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function FYPPreview() {
  const [fypDocument, setFypDocument] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Ensure localStorage access only on the client side
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
        const response = await fetch(`/api/UploadFile/GetUploadedFile?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setFypDocument(data.fypDocument);
          setProjectTitle(data.projectTitle);
          setGroupMembers(data.groupMembers);
        } else {
          console.error("Error fetching FYP document:", data.message);
        }
      } catch (error) {
        console.error("Error fetching FYP document:", error);
      }
    };
    fetchData();
  }, [userId]);


  // Function to trigger download
  const handleDownload = async () => {
    if (!fypDocument) return;
  
    const response = await fetch(fypDocument);
    try {
      // Adjusted path for the file
  
      if (!response.ok) {
        console.error("File not found.");
        return;
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      const a = document.createElement("a");
      a.href = url;
  
      // Use the original file name from the backend
      const fileName = fypDocument.split("/").pop();
      a.download = fileName || "FYP_Document.docx"; // Use dynamic file name
  
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
        {fypDocument ? (
          <button onClick={handleDownload} className="text-blue-500 hover:underline">
            Download FYP Document
          </button>
        ) : (
          <p className="text-gray-700">No document uploaded.</p>
        )}
        {/* <h4 className="mt-4 font-semibold">Project Title: {projectTitle}</h4>
        <h4 className="mt-2 font-semibold">Group Members:</h4>
        <ul>
          {groupMembers.map((member) => (
            <li key={member._id}>{member.name} ({member.rollNumber})</li>
          ))}
        </ul> */}
        <br />
        <Link href="/studentportal">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Back</button>
        </Link>
      </div>
    </div>
  );
}
