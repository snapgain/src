import React from 'react';

const Progress = ({ value = 0, className = "", max = 100, ...props }) => {
  const percentage = Math.min(Math.max(value, 0), max);
  
  return (
    <div
      className={`relative w-full bg-gray-200 rounded-full overflow-hidden ${className}`}
      {...props}
    >
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300 ease-out"
        style={{
          width: `${(percentage / max) * 100}%`,
        }}
      />
    </div>
  );
};

export { Progress };
export default Progress;