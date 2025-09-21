import React from 'react';

const BreastBeaconLogo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 hover:scale-105"
      >
        {/* Outer circle/beacon */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="white"
          stroke="#3B82F6"
          strokeWidth="2"
        />
        
        {/* Inner pink ribbon shape */}
        <path
          d="M24 12 C18 12 14 16 14 24 C14 32 18 36 24 36 C30 36 34 32 34 24 C34 16 30 12 24 12 Z"
          fill="#EC4899"
        />
        
        {/* Ribbon loop details */}
        <path
          d="M20 16 C16 18 16 22 20 24 M28 16 C32 18 32 22 28 24"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Beacon light rays */}
        <path
          d="M24 4 L26 8 L22 8 Z"
          fill="#60A5FA"
        />
        <path
          d="M4 24 L8 26 L8 22 Z"
          fill="#60A5FA"
        />
        <path
          d="M24 44 L26 40 L22 40 Z"
          fill="#60A5FA"
        />
        <path
          d="M44 24 L40 26 L40 22 Z"
          fill="#60A5FA"
        />
        
        {/* Heart shape in center */}
        <path
          d="M24 28 C26 26 28 24 28 22 C28 20 26 18 24 20 C22 18 20 20 20 22 C20 24 22 26 24 28 Z"
          fill="white"
        />
      </svg>
    </div>
  );
};

export default BreastBeaconLogo;