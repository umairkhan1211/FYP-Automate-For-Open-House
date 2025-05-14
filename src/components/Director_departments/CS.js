import React from "react";


export const csprojects = [
  {
    id: 1,
    title: "AI-Powered Chatbot",
    supervisor: "Dr. Alan Turing",
    supervisorStatus: "Approved",
    qaTeamStatus: "Approved",
    progress: 100,
  },
  {
    id: 2,
    title: "Blockchain Security",
    supervisor: "Dr. Ada Lovelace",
    supervisorStatus: "Approved",
    qaTeamStatus: "Pending",
    progress: 50,
  },
  {
    id: 3,
    title: "Quantum Computing Algorithms",
    supervisor: "Dr. Grace Hopper",
    supervisorStatus: "Rejected",
    qaTeamStatus: "Rejected",
    progress: 0,
  },
  {
    id: 4,
    title: "Machine Learning for Healthcare",
    supervisor: "Dr. Tim Berners-Lee",
    supervisorStatus: "Approved",
    qaTeamStatus: "Pending",
    progress: 50,
  },
  {
    id: 5,
    title: "Cybersecurity Threat Analysis",
    supervisor: "Dr. Linus Torvalds",
    supervisorStatus: "Pending",
    qaTeamStatus: "Pending",
    progress: 0,
  },
  {
    id: 6,
    title: "Augmented Reality Applications",
    supervisor: "Dr. Margaret Hamilton",
    supervisorStatus: "Approved",
    qaTeamStatus: "Approved",
    progress: 100,
  },
  {
    id: 7,
    title: "Data Science for Social Good",
    supervisor: "Dr. Donald Knuth",
    supervisorStatus: "Approved",
    qaTeamStatus: "Pending",
    progress: 50,
  },
];
function CS() {

  const totalProjects = csprojects.length;
  const pendingProjects = csprojects.filter(
    (p) => p.supervisorStatus === "Pending" || p.qaTeamStatus === "Pending"
  ).length;
  const approvedProjects = csprojects.filter(
    (p) => p.supervisorStatus === "Approved" && p.qaTeamStatus === "Approved"
  ).length;
  const rejectedProjects = csprojects.filter(
    (p) => p.supervisorStatus === "Rejected" || p.qaTeamStatus === "Rejected"
  ).length;

  return (
  <>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl text-[#0069D9] font-bold text-center mb-6">
          Computer Science Department
        </h2>
        <div className="text-black mt-4 mb-4">
          <p className="text-md font-semibold">
            Total Projects: {totalProjects}
          </p>
          <p className="text-md font-semibold mt-2">
            Pending Projects: {pendingProjects}
          </p>
          <p className="text-md font-semibold mt-2">
            Approved Projects: {approvedProjects}
          </p>
          <p className="text-md font-semibold mt-2">
            Rejected Projects: {rejectedProjects}
          </p>
        </div>
      </div>
      <table className="min-w-full text-center text-sm font-light border-2 border-[#0069D9] rounded-lg">
        <thead className="border-b font-medium rounded-lg">
          <tr className="border-2 border-[#0069D9]">
            <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9] border-r-white">
              No.
            </th>
            <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9] border-l-white border-r-white">
              Project Title
            </th>
            <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9] border-l-white border-r-white">
              Supervisor Name
            </th>
            <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9] border-l-white border-r-white">
              Supervisor Status
            </th>
            <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9] border-l-white border-r-white">
              QA Team Status
            </th>
            <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9]">
              Completed (%)
            </th>
          </tr>
        </thead>
        <tbody className="text-[#0069D9]">
          {csprojects.map((project, index) => (
            <tr key={project.id} className="border-b border-2 border-[#0069D9]">
              <td className="whitespace-nowrap px-6 py-4 font-medium border-2 border-[#0069D9]">
                {index + 1}
              </td>
              <td className="whitespace-nowrap px-6 py-4 border-2 border-[#0069D9]">
                {project.title}
              </td>
              <td className="whitespace-nowrap px-6 py-4 border-2 border-[#0069D9]">
                {project.supervisor}
              </td>
              <td className="whitespace-nowrap px-6 py-4 border-2 border-[#0069D9]">
                {project.supervisorStatus}
              </td>
              <td className="whitespace-nowrap px-6 py-4 border-2 border-[#0069D9]">
                {project.qaTeamStatus}
              </td>
              <td className="whitespace-nowrap px-6 py-4 border-2 border-[#0069D9]">
                {project.progress}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
   
          </>
  );
}

export default CS;
