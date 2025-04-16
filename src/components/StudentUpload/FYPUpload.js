import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function FYPUpload() {
  // const [membersCount, setMembersCount] = useState(0);
  // const [members, setMembers] = useState([]);
  // const [projectTitle, setProjectTitle] = useState("");
  const [fypDocument, setFypDocument] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

  const handleMembersCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count)) {
      setMembersCount(count);
      setMembers(Array(count).fill({ name: "", rollNumber: "" }));
    } else {
      setMembersCount(0);
      setMembers([]);
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fypDocument", fypDocument);
    // formData.append("projectTitle", projectTitle);
    // formData.append("groupMembers", JSON.stringify(members));
    formData.append("userId", localStorage.getItem("userId"));
    formData.append("fileType", "fypDocument"); // Add fileType

    const response = await fetch("/api/UploadFile/Upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      toast.success("Form submitted successfully!");
      setIsSubmitted(true); // Disable submit button
      resetForm(); // Reset the form after submission
    } else {
      toast.error(`Error: ${data.error}`);
    }
  };

  const resetForm = () => {
    // setMembersCount(0);
    // setMembers([]);
    // setProjectTitle("");
    setFypDocument(null);
    setIsSubmitted(false); // Reset submission status
  };

  const isFormValid = () => {
    return (
      // projectTitle &&
      // members.every((member) => member.name && member.rollNumber) &&
      fypDocument
    );
  };

  return (
    <div className="p-16 text-left">
      <div className="max-w-2xl mx-auto p-6 border-2 border-[#0069D9] rounded">
        <form onSubmit={handleSubmit} className="space-y-4 text-[#0069D9]">
          {/* <div className="space-y-2">
            <label className="block">
              <strong>Project Title:</strong>
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block">
              <strong>Number of Members:</strong>
            </label>
            <select
              onChange={handleMembersCountChange}
              className="w-full p-2 border rounded outline-none border-gray-300 text-gray-400"
              required
            >
              <option value="">Select</option>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          {members.map((member, index) => (
            <div key={index} className="space-x-10 flex">
              <div>
                <label className="block">
                  <strong>Member {index + 1} Name:</strong>
                </label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) =>
                    handleMemberChange(index, "name", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label className="block">
                  <strong>Roll Number:</strong>
                </label>
                <input
                  type="text"
                  value={member.rollNumber}
                  onChange={(e) =>
                    handleMemberChange(index, "rollNumber", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  placeholder="fa21-bse-070"
                />
              </div>
            </div>
          ))} */}
          <div className="space-y-2">
            <label className="block">
              <strong>FYP Document (.docx):</strong>
            </label>
            <input
              type="file"
              accept=".docx"
              onChange={(e) => {
                setFypDocument(e.target.files[0]);
                toast.success("File selected successfully!"); // Toast for file selection
              }}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!isFormValid() || isSubmitted} // Disable if form is invalid or already submitted
              >
                Submit
              </button>
            </div>
            <div>
              <Link href="/studentportal">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Back
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
