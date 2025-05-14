import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import CS, { csprojects } from "../../components/Director_departments/CS";
import SE, { seprojects } from "../../components/Director_departments/SE";
import ME, { meprojects } from "../../components/Director_departments/ME";
import EE, { eeprojects } from "../../components/Director_departments/EE";
import CE, { ceprojects } from "../../components/Director_departments/CE";

export async function getServerSideProps({ req }) {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token }, // Pass the token to the page as a prop
  };
}

function Index({ token }) {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const allProjects = [
    ...csprojects.map((project) => ({ ...project, department: "CS" })),
    ...seprojects.map((project) => ({ ...project, department: "SE" })),
    ...meprojects.map((project) => ({ ...project, department: "ME" })),
    ...eeprojects.map((project) => ({ ...project, department: "EE" })),
    ...ceprojects.map((project) => ({ ...project, department: "CE" })),
  ];

  const totalProjects = allProjects.length;
  const pendingProjects = allProjects.filter(
    (p) => p.supervisorStatus === "Pending" || p.qaTeamStatus === "Pending"
  ).length;
  const approvedProjects = allProjects.filter(
    (p) => p.supervisorStatus === "Approved" && p.qaTeamStatus === "Approved"
  ).length;
  const rejectedProjects = allProjects.filter(
    (p) => p.supervisorStatus === "Rejected" || p.qaTeamStatus === "Rejected"
  ).length;

  return (
    <Layout token={token}>
      <div className="p-4">
        <div className="my-4 space-x-2 pl-10">
          {["All", "CS", "SE", "ME", "CE", "EE"].map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
                selectedDepartment === dept
                  ? "bg-[#0069D9] text-white border-[#0069D9]"
                  : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {selectedDepartment === "All" && (
          <>
            <div className="container mx-auto p-6">
              <h2 className=" text-[#0069D9] text-2xl font-bold text-center mb-6">
                All Departments
              </h2>
              <div className="mt-4 mb-4 text-black">
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
              <thead className="border-b font-medium  rounded-lg">
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
                  <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9] border-l-white border-r-white">
                    Department
                  </th>
                  <th className="px-6 py-4 border-2 text-white bg-[#0069D9] border-[#0069D9]">
                    Completed (%)
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#0069D9]">
                {allProjects.map((project, index) => (
                  <tr key={project.id} className="border-b border-2 border-[#0069D9]">
                    <td className="whitespace-nowrap px-6 py-4 font-xs border-2 border-[#0069D9]">
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
                      {project.department}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 border-2 border-[#0069D9]">
                      {project.progress}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {selectedDepartment === "CS" && <CS />}
        {selectedDepartment === "SE" && <SE />}
        {selectedDepartment === "ME" && <ME />}
        {selectedDepartment === "EE" && <EE />}
        {selectedDepartment === "CE" && <CE />}
      </div>
    </Layout>
  );
}

export default Index;
