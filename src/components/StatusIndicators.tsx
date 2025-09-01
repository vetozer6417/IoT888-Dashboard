import React, { useEffect } from 'react';
import { Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import type { KnockData } from '../types';

interface StatusIndicatorsProps {
  knock: KnockData;
}

const StatusIndicators: React.FC<StatusIndicatorsProps> = ({ knock }) => {
  // Show toast when knock is detected
  useEffect(() => {
    if (knock && knock.detected) {
      toast(
        `🚨 ผู้ป่วยล้ม!`,
        {
          duration: 5000, // 5 seconds
          icon: '🔔',
          style: {
            borderRadius: '10px',
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #f59e0b',
            fontSize: '16px',
            fontWeight: '600',
          },
        }
      );
    }
  }, [knock]);

  // Add null check for props
  if (!knock) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Status Indicators</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const getKnockColor = () => {
    return knock.detected ? 'text-orange-500' : 'text-gray-400';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Status Indicators</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Knock Sensor */}
        <div className="text-center p-4 border rounded-lg">
          <div className="flex justify-center mb-2">
            <Zap className={`w-8 h-8 ${getKnockColor()}`} />
          </div>
          <div className="text-lg font-semibold text-gray-800 mb-1">Knock Sensor</div>
          <div className={`text-2xl font-bold ${getKnockColor()} mb-1`}>
            {knock.detected ? 'DETECTED' : 'No Knock'}
          </div>
          <div className="text-sm text-gray-600 mb-1">
            Count: {knock.count}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(knock.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      <div className="mt-4 space-y-2">
        {knock.detected && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-orange-700 font-medium">
                Knock detected! Someone may be at the door.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusIndicators;