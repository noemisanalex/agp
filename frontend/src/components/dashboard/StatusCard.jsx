import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const StatusCard = ({ title, status = 'unknown', icon: Icon, color = 'text-white' }) => {
  const getIndicator = () => {
    switch (status) {
      case 'up':
        return <CheckCircle className="text-green-400 w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="text-yellow-400 w-5 h-5" />;
      case 'down':
        return <XCircle className="text-red-500 w-5 h-5" />;
      default:
        return <AlertTriangle className="text-gray-500 w-5 h-5" />;
    }
  };

  const borderColor =
    status === 'up'
      ? 'border-green-600'
      : status === 'warning'
      ? 'border-yellow-500'
      : status === 'down'
      ? 'border-red-600'
      : 'border-gray-600';

  return (
    <div className={`flex items-center gap-4 bg-gray-900/60 p-4 rounded-xl border ${borderColor} shadow-sm`}>
      <div className={`p-2 rounded-full bg-gray-800/70 ${color}`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div>{getIndicator()}</div>
    </div>
  );
};

export default StatusCard;
