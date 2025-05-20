import React, { useEffect, useState } from 'react';
import Carditems from '../../components/AdminPanel/Carditems';
import axios from 'axios';

const Cards = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('/api/director/directorStats', config);
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className='transition-all flex flex-wrap gap-3 p-4 duration-300 sm:px-7'>
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className='flex w-full flex-col gap-4 rounded-xl bg-gray-200 dark:bg-gray-700 p-5 sm:flex-1 animate-pulse'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600'></div>
              <div className='h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded'></div>
            </div>
            <div className='h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded ml-auto'></div>
          </div>
        ))}
      </div>
    );
  }

  const carddata = [
    {
      name: 'TOTAL PROJECTS',
      icon: "bi-shield-fill-check",
      value: stats?.totalProjects?.total || 0,
      details: stats?.totalProjects?.details || [
        {},
        {}
      ]
    },
    {
      name: 'TOTAL APPROVED',
      icon: "bi-send-check-fill",
      value: stats?.approvedProjects?.total || 0,
      details: stats?.approvedProjects?.details || [
        { label: 'Supervisor', value: 0 },
        { label: 'QA', value: 0 }
      ]
    },
    {
      name: 'TOTAL REJECTED',
      icon: "bi-file-earmark-x-fill",
      value: stats?.rejectedProjects?.total || 0,
      details: stats?.rejectedProjects?.details || [
        { label: 'Supervisor', value: 0 },
        { label: 'QA', value: 0 }
      ]
    },
    {
      name: 'TOTAL PENDING',
      icon: "bi-hourglass-split",
      value: stats?.pendingProjects?.total || 0,
      details: stats?.pendingProjects?.details || [
        { label: 'Supervisor', value: 0 },
        { label: 'QA', value: 0 }
      ]
    }
  ];

  return (
    <div className='transition-all flex flex-wrap gap-3 p-4 duration-300 sm:px-7'>
      {carddata.map((item, index) => (
        <Carditems item={item} key={index} />
      ))}
    </div>
  );
};

export default Cards;