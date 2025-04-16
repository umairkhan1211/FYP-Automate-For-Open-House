import React from 'react';

const Title = ({ children }) => {
  return (
    <div className='mb-5 flex items-center justify-between'>
      <h2 className='text-xl font-bold'>{children}</h2>
    </div>
  );
};

export default Title;
