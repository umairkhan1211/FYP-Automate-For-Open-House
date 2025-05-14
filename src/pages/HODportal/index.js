import Layout from "../../components/layouts/Layout";
import React from "react";

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
  // Dummy data for demonstration
  const projects = [
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

  const totalProjects = projects.length;
  const pendingProjects = projects.filter(
    (p) => p.supervisorStatus === "Pending" || p.qaTeamStatus === "Pending"
  ).length;
  const approvedProjects = projects.filter(
    (p) => p.supervisorStatus === "Approved" && p.qaTeamStatus === "Approved"
  ).length;
  const rejectedProjects = projects.filter(
    (p) => p.supervisorStatus === "Rejected" || p.qaTeamStatus === "Rejected"
  ).length;

  return (
    <Layout token={token}>
      <div className="p-10">
        <div className="container mx-auto p-6">
          <h2 className="text-[#0069D9] text-2xl font-bold text-center mb-6">
            Computer Science Department
          </h2>
          <div className="mt-4 text-black">
            <p className="text-md font-semibold">Total Projects: {totalProjects}</p>
            <p className="text-md font-semibold">Pending Projects: {pendingProjects}</p>
            <p className="text-md font-semibold">Approved Projects: {approvedProjects}</p>
            <p className="text-md font-semibold">Rejected Projects: {rejectedProjects}</p>
          </div>
        </div>
        <table className="min-w-full  text-center text-sm  font-light border-2 border-[#0069D9] rounded-lg">
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
            {projects.map((project, index) => (
              <tr
                key={project.id}
                className="border-b border-2 border-[#0069D9]"
              >
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
      </div>
    </Layout>
  );
}

export default Index;
