import Link from "next/link";
import React from "react";
import QAChecklist from "../../components/QAChecklist/QAChecklist";

export default function FYPPreview() {
  const projectTitle = "Automated QA System";
  const groupMembers = [
    { name: "Dabish Ijaz", rollNumber: "FA21-BSE-074" },
    { name: "Ahsan Nazir", rollNumber: "FA21-BSE-042" },
    { name: "Malik Qadeer", rollNumber: "FA21-BSE-040" },
  ];
  const fypDocumentText =
    "This is a brief overview of the FYP document content.";

  return (
    <div className="p-6">
       <div className="my-2  mx-44">
          <Link href="/QAportal/Review">
            <button
              className={
                "border-2 rounded-lg text-md font-semibold py-1 px-4 border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-[#0069D9]"
              }
            >
              Back
            </button>
          </Link>
        </div>
      <div className="flex flex-col md:flex-row p-2 ">
        <div className="flex-1 max-w-lg mx-auto  border-2 border-[#0069D9] rounded-lg p-6 space-y-4 bg-white">
          <div>
            <h3 className="text-lg font-semibold">Project Title:</h3>
            <p className="text-gray-700">{projectTitle}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Group Members:</h3>
            <ul className="list-disc list-inside">
              {groupMembers.map((member, index) => (
                <li key={index} className="text-gray-700">
                  {member.name} - {member.rollNumber}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">FYP Document:</h3>
            <p className="text-gray-700">{fypDocumentText}</p>
          </div>
        </div>
        <div>
          <QAChecklist type="fyp" />
        </div>
      </div>
    </div>
  );
}
