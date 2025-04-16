import React, { useState } from "react";

function QAChecklist({ type }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [checklist, setChecklist] = useState(QAChecklist(type));

  function QAChecklist(type) {
    switch (type) {
      case "cv":
        return [
          {
            id: 1,
            parameter: "CV should be match with given template",
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
            parameter: "Alignement or Formatting ",
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
            parameter: "FYP Documnet Formate",
            accepted: false,
            rejected: false,
          },
          {
            id: 2,
            parameter: "UML Diagrams should be in document",
            accepted: false,
            rejected: false,
          },
          {
            id: 3,
            parameter: "Line spacing not more than 1.5",
            accepted: false,
            rejected: false,
          },
          {
            id: 4,
            parameter: "Font Missmatching",
            accepted: false,
            rejected: false,
          },
        ];
      case "video":
        return [
          {
            id: 1,
            parameter: "Demo Video should be 7 min or above",
            accepted: false,
            rejected: false,
          },
          {
            id: 2,
            parameter: "Banner size 200px",
            accepted: false,
            rejected: false,
          },
          {
            id: 3,
            parameter: "Image can be in jpg , jpeg , png ",
            accepted: false,
            rejected: false,
          },
          {
            id: 4,
            parameter: "AI Voice not be used in Video  ",
            accepted: false,
            rejected: false,
          },
        ];
      default:
        return [];
    }
  }

  const handleRejectClick = (id) => {
    setIsModalOpen(true);
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, rejected: true, accepted: false } : item
      )
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Rejection Reason:", reason);
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (id, type) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              accepted: type === "accept",
              rejected: type === "reject",
            }
          : item
      )
    );
  };

  return (
    <div className="flex-1 sticky top-0 p-6 bg-white border-l-2 border-[#0069D9]">
      <div className="flex justify-start space-x-2">
        <div className="my-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 7.28595 22 4.92893 20.5355 3.46447C19.0711 2 16.714 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447ZM10.5431 7.51724C10.8288 7.2173 10.8172 6.74256 10.5172 6.4569C10.2173 6.17123 9.74256 6.18281 9.4569 6.48276L7.14286 8.9125L6.5431 8.28276C6.25744 7.98281 5.78271 7.97123 5.48276 8.2569C5.18281 8.54256 5.17123 9.01729 5.4569 9.31724L6.59976 10.5172C6.74131 10.6659 6.9376 10.75 7.14286 10.75C7.34812 10.75 7.5444 10.6659 7.68596 10.5172L10.5431 7.51724ZM13 8.25C12.5858 8.25 12.25 8.58579 12.25 9C12.25 9.41422 12.5858 9.75 13 9.75H18C18.4142 9.75 18.75 9.41422 18.75 9C18.75 8.58579 18.4142 8.25 18 8.25H13ZM10.5431 14.5172C10.8288 14.2173 10.8172 13.7426 10.5172 13.4569C10.2173 13.1712 9.74256 13.1828 9.4569 13.4828L7.14286 15.9125L6.5431 15.2828C6.25744 14.9828 5.78271 14.9712 5.48276 15.2569C5.18281 15.5426 5.17123 16.0173 5.4569 16.3172L6.59976 17.5172C6.74131 17.6659 6.9376 17.75 7.14286 17.75C7.34812 17.75 7.5444 17.6659 7.68596 17.5172L10.5431 14.5172ZM13 15.25C12.5858 15.25 12.25 15.5858 12.25 16C12.25 16.4142 12.5858 16.75 13 16.75H18C18.4142 16.75 18.75 16.4142 18.75 16C18.75 15.5858 18.4142 15.25 18 15.25H13Z"
                fill="#0069D9"
              ></path>
            </g>
          </svg>
        </div>

        <div className="">
          <h3 className="text-xl my-5 font-semibold mb-4">Checklist</h3>
        </div>
      </div>
      <ul>
        {checklist.map((item) => (
          <li key={item.id} className="mb-4">
            <p>{item.parameter}</p>
            <div className="flex items-center space-x-2">
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
                  onChange={() => handleRejectClick(item.id)}
                />
                Reject
              </label>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="mt-4 border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-white bg-[#0069D9] hover:bg-white hover:text-[#0069D9] hover:border-[#0069D9] focus:outline-none focus:shadow-outline  disabled:opacity-50"
        disabled={!checklist.every((item) => item.accepted || item.rejected)}
      >
        Submit
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Rejection Reason</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter reason"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
