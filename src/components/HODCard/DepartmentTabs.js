// components/HODCard/DepartmentTabs.js
import React, { useState } from 'react';
import ComputerScienceProjects from './ComputerScienceProjects';
import SoftwareEngineeringProjects from './SoftwareEngineeringProjects';
import AIProjects from './AIProjects';

const DepartmentTabs = ({ token, department }) => {
  const [activeTab, setActiveTab] = useState(department.toLowerCase());
  
  // Only show tabs for the HOD's department
  const showAllTabs = department.toLowerCase() === 'computer science' || 
                     department.toLowerCase() === 'software engineering' || 
                     department.toLowerCase() === 'ai';

  const tabs = [
    { id: 'computer science', label: 'Computer Science', component: <ComputerScienceProjects token={token} department={department} /> },
    { id: 'software engineering', label: 'Software Engineering', component: <SoftwareEngineeringProjects token={token} department={department} /> },
    { id: 'ai', label: 'AI', component: <AIProjects token={token} department={department} /> }
  ];

  // Filter tabs based on department if not allowed to see all
  const visibleTabs = showAllTabs ? tabs : tabs.filter(tab => tab.id === department.toLowerCase());

  // Special case for departments without tabs
  if (!showAllTabs && !tabs.some(tab => tab.id === department.toLowerCase())) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p className="font-bold">No Projects Available</p>
          <p>Currently there are no students with projects in the {department} department.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex border-b border-gray-200">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? 'border-b-2 border-[#0069D9] text-[#0069D9]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="mt-4">
        {visibleTabs.map(tab => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentTabs;