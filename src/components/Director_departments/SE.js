import React from "react";

 export const seprojects = [
    {
      id: 1,
      title: "Streamline Fyp for Open House",
      supervisor: "Sir Bilal",
      supervisorStatus: "Approved",
      qaTeamStatus: "Approved",
      progress: 100,
    },
    {
      id: 2,
      title: "Hunter Cab",
      supervisor: "Sir Kashif Ayub",
      supervisorStatus: "Approved",
      qaTeamStatus: "Pending",
      progress: 50,
    },
    {
      id: 3,
      title: "Artificial Neural Networking",
      supervisor: "Mam Ayesha",
      supervisorStatus: "Rejected",
      qaTeamStatus: "Rejected",
      progress: 0,
    },
    {
      id: 4,
      title: "Code Hub",
      supervisor: "Mam Sana",
      supervisorStatus: "Approved",
      qaTeamStatus: "Pending",
      progress: 50,
    },
    {
      id: 5,
      title: "AI Research",
      supervisor: "Sir Ibrahim",
      supervisorStatus: "Pending",
      qaTeamStatus: "Pending",
      progress: 0,
    },
    {
      id: 6,
      title: "IoT Innovations",
      supervisor: "Dr Taswar Iqbal",
      supervisorStatus: "Approved",
      qaTeamStatus: "Approved",
      progress: 100,
    },
    {
      id: 7,
      title: "Blockchain Basics",
      supervisor: "Sir Ishfaq",
      supervisorStatus: "Approved",
      qaTeamStatus: "Pending",
      progress: 50,
    },
  ];
function SE() {

  const totalProjects = seprojects.length;
  const pendingProjects = seprojects.filter(
    (p) => p.supervisorStatus === "Pending" || p.qaTeamStatus === "Pending"
  ).length;
  const approvedProjects = seprojects.filter(
    (p) => p.supervisorStatus === "Approved" && p.qaTeamStatus === "Approved"
  ).length;
  const rejectedProjects = seprojects.filter(
    (p) => p.supervisorStatus === "Rejected" || p.qaTeamStatus === "Rejected"
  ).length;

  return (
    <>

      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
         Software Engineering Department
        </h2>
        <div className="mt-4 mb-4 ">
          <p className="text-md font-semibold ">
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
        <tbody>
          {seprojects.map((project, index) => (
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

export default SE;
