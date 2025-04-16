import React, { useState } from "react";

export default function QAupload() {
  const [subject, setSubject] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [file, setFile] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleUploadTypeChange = (e) => {
    setUploadType(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subject:", subject);
    console.log("Upload Type:", uploadType);
    console.log("File:", file);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);
    // Here you can handle the form submission to the backend
  };

  return (
    <div className="p-6">
      <div className="p-6 max-w-md mx-auto bg-white border-2 rounded-lg border-[#0069D9]">
        <h2 className="text-xl text-center font-semibold mb-4">Upload Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={handleSubjectChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter subject"
              required
            />
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Type
              </label>
              <select
                value={uploadType}
                onChange={handleUploadTypeChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select upload type</option>
                <option value="cvTemplate">CV Template</option>
                <option value="assignment">Assignment</option>
                <option value="submissionDeadline">
                  Submission Deadline
                </option>
                {/* Add more options as needed */}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Finish Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-white bg-[#0069D9] hover:bg-white hover:text-[#0069D9] hover:border-[#0069D9] focus:outline-none focus:shadow-outline"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
