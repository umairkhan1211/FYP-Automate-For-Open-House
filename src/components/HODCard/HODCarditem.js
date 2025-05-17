import React from 'react'

function HODCarditem({ item }) {
  return (
    <div className='flex w-full flex-col gap-4 rounded-xl bg-[#0069D9] text-white p-5 dark:bg-white dark:text-[#0069D9] sm:flex-1'>
      <div className='flex items-center gap-3'>
        <i className={`bi ${item.icon} text-2xl`}></i>
        <h3 className='text-sm font-semibold'>{item.name}</h3>
      </div>
      
      <h1 className='text-xl font-extrabold text-right'>{item.value}</h1>
      
      {/* Display details if they exist */}
      {item.details && item.details.length > 0 && (
        <div className='flex justify-between text-xs mt-2'>
          {item.details.map((detail, idx) => (
            <div key={idx}>
              <span>{detail.label}: </span>
              <span className='font-bold'>{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HODCarditem;