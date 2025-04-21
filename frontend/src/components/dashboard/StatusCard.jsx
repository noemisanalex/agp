import React from 'react';

export default function StatusCard({ title, value, icon }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4 h-32 flex flex-col justify-center items-center w-full">
      <div className="text-gray-400 text-sm flex items-center gap-1">
        {icon} {title}
      </div>
      <div className="text-white text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
