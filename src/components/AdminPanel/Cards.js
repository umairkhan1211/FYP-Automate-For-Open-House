import React from 'react'
import Carditems from '../../components/AdminPanel/Carditems';

const carddata = [
    {
      name: 'TOTAL PROJECTS',
      icon:"bi-shield-fill-check",
      value: 50,
      details: [
        { label: 'Supervisor', value: 20 },
        { label: 'QA', value: 30 } // 50 - 20 = 30 (remaining projects)
      ]
    },
    {
      name: 'TOTAL APPROVED',
      icon:"bi-send-check-fill",
      value: 20 + 8, // Supervisor + QA approved projects
      details: [
        { label: 'Supervisor', value: 20 },
        { label: 'QA', value: 8 }
      ]
    },
    {
      name: 'TOTAL REJECTED',
      icon:"bi-file-earmark-x-fill",
      value: 10 + 4, // Supervisor + QA rejected projects
      details: [
        { label: 'Supervisor', value: 10 },
        { label: 'QA', value: 4 }
      ]
    },
    {
      name: 'TOTAL PENDING',
      icon:"bi-hourglass-split",
      value: 5 + 3, // Supervisor + QA pending projects
      details: [
        { label: 'Supervisor', value: 5 },
        { label: 'QA', value: 3 }
      ]
    }
  ];

  function Cards({ darkMode }) {
    return (
      <div className='transition-all flex flex-wrap gap-3 p-4 duration-300 sm:px-7'>
        {carddata.map((item , index) => {
          return <Carditems item={item} key={index} />; 
        })}
      </div>
    );
  }
  
  export default Cards;