import React from "react";


export const eeprojects = [
  {
    id: 1,
    title: "Smart Grid Technology",
    supervisor: "Dr. Nikola Tesla",
    supervisorStatus: "Approved",
    qaTeamStatus: "Approved",
    progress: 100,
  },
  {
    id: 2,
    title: "Wireless Power Transmission",
    supervisor: "Dr. Heinrich Hertz",
    supervisorStatus: "Approved",
    qaTeamStatus: "Pending",
    progress: 50,
  },
  {
    id: 3,
    title: "Electric Vehicle Charging Stations",
    supervisor: "Dr. Thomas Edison",
    supervisorStatus: "Rejected",
    qaTeamStatus: "Rejected",
    progress: 0,
  },
  {
    id: 4,
    title: "Renewable Energy Integration",
    supervisor: "Dr. James Clerk Maxwell",
    supervisorStatus: "Approved",
    qaTeamStatus: "Pending",
    progress: 50,
  },
  {
    id: 5,
    title: "Microgrid Systems",
    supervisor: "Dr. Michael Faraday",
    supervisorStatus: "Pending",
    qaTeamStatus: "Pending",
    progress: 0,
  },
  {
    id: 6,
    title: "Power Electronics for Solar Panels",
    supervisor: "Dr. Alexander Graham Bell",
    supervisorStatus: "Approved",
    qaTeamStatus: "Approved",
    progress: 100,
  },
  {
    id: 7,
    title: "IoT in Smart Homes",
    supervisor: "Dr. Guglielmo Marconi",
    supervisorStatus: "Approved",
    qaTeamStatus: "Pending",
    progress: 50,
  },
];
function EE() {

  const totalProjects = eeprojects.length;
  const pendingProjects = eeprojects.filter(
    (p) => p.supervisorStatus === "Pending" || p.qaTeamStatus === "Pending"
  ).length;
  const approvedProjects = eeprojects.filter(
    (p) => p.supervisorStatus === "Approved" && p.qaTeamStatus === "Approved"
  ).length;
  const rejectedProjects = eeprojects.filter(
    (p) => p.supervisorStatus === "Rejected" || p.qaTeamStatus === "Rejected"
  ).length;

  return (
    <>
      <div className="container mx-auto p-6">
        <h2 className="text-[#0069D9] text-2xl font-bold text-center mb-6">
          Electrical Engineering Department
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
        <tbody className="text-[#0069D9]" >
          {eeprojects.map((project, index) => (
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

export default EE;
