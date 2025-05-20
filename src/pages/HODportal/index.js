// pages/hod/index.js
import HODCard from '../../components/HODCard/HODCard';
import Layout from "../../components/layouts/Layout";
import React, { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';
import DepartmentTabs from '../../components/HODCard/DepartmentTabs';

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
    props: { token },
  };
}

function Index({ token }) {
  const [projectCount, setProjectCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Decode token to get department
        const decoded = jwt.decode(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }
        
        setDepartment(decoded.department);

        // Call all APIs in parallel
        const [projectsRes, approvedRes, rejectedRes, pendingRes] = await Promise.all([
          fetch(`/api/HodData/getProjectCount?department=${encodeURIComponent(decoded.department)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`/api/HodData/getApprovedCount?department=${encodeURIComponent(decoded.department)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`/api/HodData/getRejectedCount?department=${encodeURIComponent(decoded.department)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`/api/HodData/getPendingCount?department=${encodeURIComponent(decoded.department)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const projectsData = await projectsRes.json();
        const approvedData = await approvedRes.json();
        const rejectedData = await rejectedRes.json();
        const pendingData = await pendingRes.json();

        if (projectsData.success) setProjectCount(projectsData.totalProjects);
        if (approvedData.success) setApprovedCount(approvedData);
        if (rejectedData.success) setRejectedCount(rejectedData);
        if (pendingData.success) setPendingCount(pendingData);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <Layout token={token}>
        <div className="text-center py-10">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout token={token}>
      <div>
        <h2 className="text-center text-2xl text-[#0069D9] p-6 font-extrabold">
          {department || 'Department'}
        </h2>
        <HODCard 
          projectCount={projectCount} 
          approvedCount={approvedCount} 
          rejectedCount={rejectedCount} 
          pendingCount={pendingCount} 
        />
        <DepartmentTabs token={token} department={department} />
      </div>
    </Layout>
  );
}

export default Index;