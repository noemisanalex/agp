import React, { useEffect } from 'react';
import useSound from '../hooks/useSound';

export default function InfoCard({ title, value, icon: Icon, color = 'text-blue-400' }) {
 const { playHoverSound } = useSound();
 
 return (
   <div 
     className="bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition-all flex items-center gap-4 border border-gray-700 hover:border-gray-600 cursor-pointer"
     onMouseEnter={playHoverSound}
   >
     <div className={`p-3 rounded-full bg-gray-800 ${color}`}>
       <Icon className="w-6 h-6" />
     </div>
     <div>
       <h3 className="text-lg font-semibold">{title}</h3>
       <p className="text-2xl font-bold">{value}</p>
     </div>
   </div>
 );
}