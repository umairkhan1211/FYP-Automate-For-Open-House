import Link from "next/link";
import React from "react";

import QAChecklist from "../../components/QAChecklist/QAChecklist";

export default function CVPreview() {
  const dummyCVData = {
    name: "Umair Khan",
    email: "umairkhanone0@gmail.com",
    education: "Bachelor of Science in Computer Science",
    experience: [
      {
        company: "Tech Solutions Inc.",
        role: "Software Developer",
        duration: "Jan 2020 - Present",
      },
      {
        company: "Web Innovations",
        role: "Intern",
        duration: "Jun 2019 - Dec 2019",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "Python"],
  };

  return (
    <div className="p-3">
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
      <div className="flex flex-col md:flex-row p-2">
        <div className="flex-1 max-w-lg mx-auto p-6 border-2 border-[#0069D9] rounded-lg bg-white">
          <div>
            <p className="mb-2">
              <strong>Name:</strong> {dummyCVData.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {dummyCVData.email}
            </p>
            <p className="mb-4">
              <strong>Education:</strong> {dummyCVData.education}
            </p>
            <h3 className="text-xl font-semibold mb-2">Experience:</h3>
            <ul className="list-disc list-inside mb-4">
              {dummyCVData.experience.map((job, index) => (
                <li key={index} className="mb-2">
                  <strong>{job.company}</strong> - {job.role} ({job.duration})
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mb-2">Skills:</h3>
            <ul className="list-disc list-inside">
              {dummyCVData.skills.map((skill, index) => (
                <li key={index} className="mb-1">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <QAChecklist type="cv" />
        </div>
      </div>
    </div>
  );
}
