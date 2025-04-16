import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Title from './Title';
import Cards from '../../components/AdminPanel/Cards'; // Import Cards component

const data = [
  { name: 'Supervisor', Approved: 10, Rejected: 4 },
  { name: 'QA Team', Approved: 8, Rejected: 6 },
  { name: 'HOD', Approved: 15, Rejected: 3 }
];

function Statistics({ darkMode }) {
  return (
    <div>

      {/* Cards component inside Statistics */}
      {/* <div className="">
        <Cards darkMode={darkMode} /> {/* This will display your cards above the graph
      </div> */} 
    <div className="h-[400px] w-full rounded-xl p-5 pb-20  dark:bg-slate-800 dark:text-white xl:flex-1 transition-all duration-300">

        <div className='text-[#0069D9] dark:text-white transition-all duration-300 '>

      <Title>Project Statistics</Title>
        </div>
        

      <ResponsiveContainer className='bg-[#E5E7EB] p-6 rounded-xl dark:bg-white transition-all duration-300 '>
        <BarChart data={data}>
          {/* Grid */}

          {/* X-Axis */}
          <XAxis 
            dataKey="name" 
            tick={{ fill: darkMode ? "#0069D9" : "#000000" }} 
            stroke={darkMode ? "#0069D9" : "#000000"} 
          />

          {/* Y-Axis */}
          <YAxis 
            domain={[0, 18]} 
            tick={{ fill: darkMode ?"#0069D9" : "#000000" }} 
            stroke={darkMode ? "#0069D9" : "#000000"} 
          />

          {/* Tooltip & Legend */}
          <Tooltip />

          {/* Bars */}
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
