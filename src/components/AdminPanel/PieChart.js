import React from 'react';
import Title from './Title';
import { Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

function PieChart({ darkMode }) {
  const data = [
    { name: 'Approved', value: 10, color: darkMode ? '#BEBEBE' : '#0069D9' },
    { name: 'Rejected', value: 4, color: darkMode ? '#66a5e8' : '#BEBEBE' },
    { name: 'Pending', value: 6, color: darkMode ? '#0069D9' : '#66a5e8' }
  ];

  return (
    <div className="h-[400px] w-full rounded-xl p-5 pb-20 dark:bg-slate-800 dark:text-white transition-all duration-300">
      <div className='text-[#0069D9] dark:text-white transition-all duration-300'>
        <Title>Total Projects Reports</Title>
      </div>
      <ResponsiveContainer className='bg-[#E5E7EB] p-6 rounded-xl dark:bg-white transition-all duration-300'>
        <RechartsPieChart>
          <Pie 
            data={data} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={100} 
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;
