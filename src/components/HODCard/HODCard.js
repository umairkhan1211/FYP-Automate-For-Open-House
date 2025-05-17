import React from 'react'
import HODCarditem from '../../components/HODCard/HODCarditem';

function HODCard({ projectCount = 0 }) {
  const carddata = [
    {
      name: 'TOTAL PROJECTS',
      icon: "bi-shield-fill-check",
      value: projectCount,
      details: [
     
      ]
    },
    {
      name: 'TOTAL APPROVED',
      icon: "bi-send-check-fill",
      value: Math.floor(projectCount * 0.3), // Example calculation
      details: [
        { label: 'Supervisor', value: Math.floor(projectCount * 0.2) },
        { label: 'QA', value: Math.floor(projectCount * 0.1) }
      ]
    },
    {
      name: 'TOTAL REJECTED',
      icon: "bi-file-earmark-x-fill",
      value: Math.floor(projectCount * 0.1), // Example calculation
      details: [
        { label: 'Supervisor', value: Math.floor(projectCount * 0.06) },
        { label: 'QA', value: Math.floor(projectCount * 0.04) }
      ]
    },
    {
      name: 'TOTAL PENDING',
      icon: "bi-hourglass-split",
      value: projectCount - Math.floor(projectCount * 0.3) - Math.floor(projectCount * 0.1),
      details: [
        { label: 'Supervisor', value: Math.floor(projectCount * 0.14) },
        { label: 'QA', value: projectCount - Math.floor(projectCount * 0.3) - Math.floor(projectCount * 0.1) - Math.floor(projectCount * 0.14) }
      ]
    }
  ];

  return (
    <div className='transition-all flex flex-wrap gap-3 p-4 duration-300 sm:px-7'>
      {carddata.map((item, index) => {
        return <HODCarditem item={item} key={index} />;
      })}
    </div>
  );
}

export default HODCard;