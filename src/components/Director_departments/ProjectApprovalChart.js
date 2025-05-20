import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamic import for ApexCharts
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ProjectApprovalChart = ({ token }) => {
  const [chartData, setChartData] = useState({
    supervisorApproved: 0,
    supervisorRejected: 0,
    qaApproved: 0,
    qaRejected: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/director/projectApprovalStats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChartData(response.data);
      } catch (error) {
        console.error('Error fetching approval stats:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [token]);

  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: ['#00E396', '#FF4560', '#008FFB', '#FEB019'],
    xaxis: {
      categories: ['Supervisor', 'QA'],
    },
    legend: {
      position: 'top'
    },
    tooltip: {
      shared: true,
      intersect: false
    }
  };

  const series = [
    {
      name: 'Approved',
      data: [chartData.supervisorApproved, chartData.qaApproved]
    },
    {
      name: 'Rejected',
      data: [chartData.supervisorRejected, chartData.qaRejected]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Project Approval Status</h2>
      {typeof window !== 'undefined' && (
        <Chart
          options={options}
          series={series}
          type="bar"
          height={300}
        />
      )}
    </div>
  );
};

export default ProjectApprovalChart;