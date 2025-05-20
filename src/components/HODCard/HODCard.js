import React from 'react'
import HODCarditem from '../../components/HODCard/HODCarditem';

function HODCard({ 
  projectCount = 0, 
  approvedCount = { totalApproved: 0, details: { supervisor: 0, qa: 0 } }, 
  rejectedCount = { totalRejected: 0, details: { supervisor: 0, qa: 0 } }, 
  pendingCount = { totalPending: 0, details: { supervisor: 0, qa: 0 } } 
}) {
  const carddata = [
    {
      name: 'TOTAL PROJECTS',
      icon: "bi-shield-fill-check",
      value: projectCount,
      details: []
    },
    {
      name: 'TOTAL APPROVED',
      icon: "bi-send-check-fill",
      value: approvedCount.totalApproved || 0,
      details: [
        { label: 'Supervisor', value: approvedCount.details?.supervisor || 0 },
        { label: 'QA', value: approvedCount.details?.qa || 0 }
      ]
    },
    {
      name: 'TOTAL REJECTED',
      icon: "bi-file-earmark-x-fill",
      value: rejectedCount.totalRejected || 0,
      details: [
        { label: 'Supervisor', value: rejectedCount.details?.supervisor || 0 },
        { label: 'QA', value: rejectedCount.details?.qa || 0 }
      ]
    },
    {
      name: 'TOTAL PENDING',
      icon: "bi-hourglass-split",
      value: pendingCount.totalPending || 0,
      details: [
        { label: 'Supervisor', value: pendingCount.details?.supervisor || 0 },
        { label: 'QA', value: pendingCount.details?.qa || 0 }
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