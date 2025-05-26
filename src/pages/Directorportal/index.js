// pages/director/index.js
import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import jwt from 'jsonwebtoken';
import Cards from "../../components/AdminPanel/Cards";
import ProjectTrendChart from "../../components/Director_departments/ProjectApprovalChart";
import Statistics from "../../components/AdminPanel/Statistics";
import PieChart from "../../components/AdminPanel/PieChart";
import DepartmentTabss from "../../components/Director_departments/DepartmentTabss";

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

  // Verify if user is director
  const decoded = jwt.decode(token);
  if (decoded?.role !== 'director') {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { token },
  };
}

function Index({ token }) {
  const [showUpload, setShowUpload] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Layout token={token}>
      <div>
        <div className="w-11/12 min-w-lg mx-auto p-3 space-x-2 mt-5">
          <button
            onClick={() => setShowUpload(true)}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
              showUpload
                ? "bg-[#0069D9] text-white border-[#0069D9]"
                : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setShowUpload(false)}
            className={`border-2 rounded-lg text-md font-semibold py-1 px-2 ${
              !showUpload
                ? "bg-[#0069D9] text-white border-[#0069D9]"
                : "border-[#0069D9] text-[#0069D9] bg-white hover:bg-[#0069D9] hover:text-white hover:border-white"
            }`}
          >
            Project Details
          </button>
        </div>

        {showUpload ? (
          <div className="bg-gray-100 min-h-screen p-4 space-y-6">
            <Cards token={token} />
            <div className='flex flex-col xl:flex-row gap-6'>
              <div className='flex-1'>
                <Statistics token={token} />
              </div>
              <div className='flex-1'>
                <PieChart darkMode={darkMode} token={token} />
              </div>
            </div>
          </div>
        ) : (
          <DepartmentTabss token={token} />
        )}
      </div>
    </Layout>
  );
}

export default Index;