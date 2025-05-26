// components/Director_departments/DepartmentTabs.js
import React, { useState } from 'react';
import ComputerScienceProjects from '../../components/Director_departments/ComputerScienceProjects';
import SoftwareEngineeringProjects from '../../components/Director_departments/SoftwareEngineeringProjects';
import AIProjects from '../../components/Director_departments/AIProjects';
import MechanicalEnggProjects from '../../components/Director_departments/MechanicalEngineeringProjects';
import ManagementSciencesProjects from '../../components/Director_departments/ManagementSciencesProjects';
import ElectricalEnggProjects from '../../components/Director_departments/ElectricalEngineeringProjects';
import ComputerEnggProjects from '../../components/Director_departments/ComputerEngineeringProjects';
import CivilEngineeringProjects from '../../components/Director_departments/CivilEngineeringProjects';

const DepartmentTabs = ({ token }) => {
  const [activeTab, setActiveTab] = useState('computer science');
  
  const tabs = [
    { id: 'computer science', label: 'Computer Science', component: <ComputerScienceProjects token={token} /> },
    { id: 'software engineering', label: 'Software Engineering', component: <SoftwareEngineeringProjects token={token} /> },
    { id: 'ai', label: 'AI ', component: <AIProjects token={token} /> },
    { id: 'civil engg', label: 'Civil Engg', component: <CivilEngineeringProjects token={token} /> },
    { id: 'mechanical engg', label: 'Mechanical Engg', component: <MechanicalEnggProjects token={token} /> },
    { id: 'management sciences', label: 'Management Sciences', component: <ManagementSciencesProjects token={token} /> },
    { id: 'electrical engg', label: 'Electrical Engg', component: <ElectricalEnggProjects token={token} /> },
    { id: 'computer engg', label: 'Computer Engg', component: <ComputerEnggProjects token={token} /> }
  ];

  return (
    <div className="p-4">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm whitespace-nowrap focus:outline-none ${
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
        {tabs.map(tab => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentTabs;