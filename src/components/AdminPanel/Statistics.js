import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import Title from './Title';

function Statistics({ darkMode, token }) {
  const [data, setData] = useState([
    { name: 'Supervisor', Approved: 0, Rejected: 0 },
    { name: 'QA Team', Approved: 0, Rejected: 0 }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/director/projectApprovalStats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const stats = res.data;

        setData([
          { name: 'Supervisor', Approved: stats.supervisorApproved, Rejected: stats.supervisorRejected },
          { name: 'QA Team', Approved: stats.qaApproved, Rejected: stats.qaRejected }
        ]);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const maxValue = Math.max(
    ...data.map(item => Math.max(item.Approved, item.Rejected))
  );

  return (
    <div>
      <div className="h-[400px] w-full rounded-xl p-5 pb-20 dark:bg-slate-800 dark:text-white xl:flex-1 transition-all duration-300">
        <div className='text-[#0069D9] dark:text-white'>
          <Title>Project Statistics</Title>
        </div>

        <ResponsiveContainer className='bg-[#E5E7EB] p-6 rounded-xl dark:bg-white'>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: darkMode ? "#0069D9" : "#000" }} 
              stroke={darkMode ? "#0069D9" : "#000"} 
            />
            <YAxis 
              domain={[0, maxValue + 2]} 
              tick={{ fill: darkMode ? "#0069D9" : "#000" }} 
              stroke={darkMode ? "#0069D9" : "#000"} 
            />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="Approved" 
              fill={darkMode ? "#BEBEBE" : "#0069D9"} 
              radius={[10, 10, 0, 0]} 
            />
            <Bar 
              dataKey="Rejected" 
              fill={darkMode ? "#0069D9" : "#BEBEBE"} 
              radius={[10, 10, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Statistics;
