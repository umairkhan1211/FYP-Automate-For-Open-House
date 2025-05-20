// components/Director_departments/DepartmentTabs.js
import React, { useState } from 'react';
import ComputerScienceProjects from '../../components/Director_departments/ComputerScienceProjects';
import SoftwareEngineeringProjects from '../../components/Director_departments/SoftwareEngineeringProjects';
import AIProjects from '../../components/Director_departments/AIProjects';
import MechanicalEngineeringProjects from '../../components/Director_departments/MechanicalEngineeringProjects';
import CivilEngineeringProjects from '../../components/Director_departments/CivilEngineeringProjects';
import ManagementSciencesProjects from '../../components/Director_departments/ManagementSciencesProjects';
import ElectricalEngineeringProjects from '../../components/Director_departments/ElectricalEngineeringProjects';
import ComputerEngineeringProjects from '../../components/Director_departments/ComputerEngineeringProjects';

const DepartmentTabs = ({ token }) => {
  const [activeMainTab, setActiveMainTab] = useState('computer science');
  const [activeSubTab, setActiveSubTab] = useState('computer science department');

  const mainTabs = [
    { 
      id: 'computer science', 
      label: 'Computer Science',
      subTabs: [
        { id: 'computer science department', label: 'Computer Science Department' },
        { id: 'software engineering', label: 'Software Engineering' },
        { id: 'ai', label: 'AI' }
      ]
    },
    { 
      id: 'mechanical engineering', 
      label: 'Mechanical Engineering',
      subTabs: [
        { id: 'mechanical engineering department', label: 'Mechanical Engg Department' }
      ]
    },
    { 
      id: 'civil engineering', 
      label: 'Civil Engineering',
      subTabs: [
        { id: 'civil engineering department', label: 'Civil Engg Department' }
      ]
    },
    { 
      id: 'management sciences', 
      label: 'Management Sciences',
      subTabs: [
        { id: 'management sciences department', label: 'Management Sciences' }
      ]
    },
    { 
      id: 'electrical engineering', 
      label: 'Electrical Engineering',
      subTabs: [
        { id: 'electrical engineering department', label: 'Electrical Engg Department' },
        { id: 'computer engineering', label: 'Computer Engg Department' }
      ]
    }
  ];

  const renderSubTabs = () => {
    const currentMainTab = mainTabs.find(tab => tab.id === activeMainTab);
    if (!currentMainTab) return null;

    return (
      <div className="flex border-b border-gray-200 mt-2">
        {currentMainTab.subTabs.map(subTab => (
          <button
            key={subTab.id}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeSubTab === subTab.id
                ? 'border-b-2 border-[#0069D9] text-[#0069D9]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveSubTab(subTab.id)}
          >
            {subTab.label}
          </button>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch(activeSubTab) {
      case 'computer science department':
        return <ComputerScienceProjects token={token} />;
      case 'software engineering':
        return <SoftwareEngineeringProjects token={token} />;
      case 'ai':
        return <AIProjects token={token} />;
      case 'mechanical engineering department':
        return <MechanicalEngineeringProjects token={token} />;
      case 'civil engineering department':
        return <CivilEngineeringProjects token={token} />;
      case 'management sciences department':
        return <ManagementSciencesProjects token={token} />;
      case 'electrical engineering department':
        return <ElectricalEngineeringProjects token={token} />;
      case 'computer engineering':
        return <ComputerEngineeringProjects token={token} />;
      default:
        return <div>Select a department</div>;
    }
  };

  return (
    <div className="p-4">
      <div className="flex border-b border-gray-200">
        {mainTabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeMainTab === tab.id
                ? 'border-b-2 border-[#0069D9] text-[#0069D9]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => {
              setActiveMainTab(tab.id);
              setActiveSubTab(tab.subTabs[0].id);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {renderSubTabs()}
      
      <div className="mt-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default DepartmentTabs;