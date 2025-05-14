import React, { useState, useEffect } from 'react';
import AddStudent from '../../components/AdminPanel/AddStudent';
import Navbar from '../../components/AdminPanel/Navbar';
import Sidebar from '../../components/AdminPanel/Sidebar';
import AddSupervisor from '../../components/AdminPanel/AddSupervisor';
import AddQA from '../../components/AdminPanel/AddQA';
import AddHOD from '../../components/AdminPanel/AddHOD';
import AddDirector from '../../components/AdminPanel/AddDirector';
import Loader from '../../components/Loader/Loader'; // Import your Loader component
import Statistics from '../../components/AdminPanel/Statistics';
import RecordEntries from '../../components/AdminPanel/RecordEntries';
import Cards from '../../components/AdminPanel/Cards';
import PieChart from '../../components/AdminPanel/PieChart';

function Index() {
  const [selectedOption, setSelectedOption] = useState("Statistics"); // default to Statistics
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const optionTitles = {
    Statistics: 'Statistics',
    AddStudent: 'Add Student',
    AddSupervisor: 'Add Supervisor',
    AddQA: 'Add Quality Assurance Member',
    AddHOD: 'Add Head Of Department',
    AddDirector: 'Add Director',
    RecordEntries: 'Record Entries'
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 7.3 seconds
    }, 7300); // Adjust the time as needed

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (loading) {
    return <Loader />; // Show loader while loading
  }

  return (
    <div className={`flex h-screen transition-all duration-300 ${darkMode ? "dark:bg-slate-800" : "bg-gray-100"}`}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} setSelectedOption={setSelectedOption} selectedOption={selectedOption} darkMode={darkMode} />
      <div className={`flex-1 transition-all duration-300 ${isOpen ? "md:ml-64" : "ml-20"} flex flex-col h-full overflow-hidden `}>
        <Navbar title={optionTitles[selectedOption]} darkMode={darkMode} setDarkMode={setDarkMode} isOpen={isOpen} />
        
        {/* Render Cards only when Statistics is selected */}
        {selectedOption === 'Statistics' && <Cards darkMode={darkMode} />}
        
        <div className='flex flex-col gap-4 p-4 duration-300 sm:px-7 sm:py-1 xl:flex-row overflow-auto'> 
          {/* Render Statistics and PieChart side by side */}
          {selectedOption === 'Statistics' && (
            <div className='flex flex-col w-full gap-4 xl:flex-row'>
              <div className='flex-1 h-[410px] overflow-auto'>
                <Statistics darkMode={darkMode} />
              </div>
              <div className='flex-1 h-[410px] overflow-auto'>
                <PieChart darkMode={darkMode} />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-grow flex justify-center items-center overflow-hidden">
          {selectedOption === 'AddStudent' && <AddStudent darkMode={darkMode} />}
          {selectedOption === 'AddSupervisor' && <AddSupervisor darkMode={darkMode} />}
          {selectedOption === 'AddQA' && <AddQA darkMode={darkMode} />}
          {selectedOption === 'AddHOD' && <AddHOD darkMode={darkMode} />}
          {selectedOption === 'AddDirector' && <AddDirector darkMode={darkMode} />}
          {selectedOption === 'RecordEntries' && <RecordEntries darkMode={darkMode} />}
        </div>
      </div>
    </div>
  );
}

export default Index;
