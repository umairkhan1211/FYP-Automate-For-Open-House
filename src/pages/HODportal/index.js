import HODCard from '../../components/HODCard/HODCard';
import Layout from "../../components/layouts/Layout";
import React, { useEffect, useState } from "react";
import jwt from 'jsonwebtoken';

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
  const [department, setDepartment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Decode token to get department
        const decoded = jwt.decode(token);
        if (!decoded) {
          throw new Error('Invalid token');
        }
        
        setDepartment(decoded.department);

        // Call API with department
        const response = await fetch(`/api/HodData/getProjectCount?department=${encodeURIComponent(decoded.department)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        if (data.success) {
          setProjectCount(data.totalProjects);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <Layout token={token}>
      <div>
        <h2 className="text-center text-2xl text-[#0069D9] mt-4 font-extrabold">
          {department || 'Department'}
        </h2>
        <HODCard projectCount={projectCount} />
      </div>
    </Layout>
  );
}

export default Index;