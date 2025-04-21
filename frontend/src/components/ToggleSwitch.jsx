import React from 'react';
import useSound from '../hooks/useSound';

const ToggleSwitch = ({ value, onChange }) => {
 const { playToggleSound } = useSound();

 const handleToggle = (e) => {
   playToggleSound();
   onChange(e.target.checked);
 };

 return (
   <label className="inline-flex items-center cursor-pointer">
     <input type="checkbox" checked={value} onChange={handleToggle} className="sr-only" />
     <div className={`w-11 h-6 bg-gray-600 rounded-full shadow-inner transition ${value ? 'bg-green-500' : ''}`}>
       <div
         className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${
           value ? 'translate-x-5' : ''
         }`}
       />
     </div>
   </label>
 );
};

export default ToggleSwitch;