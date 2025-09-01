import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import type { GyroData } from '../types';

interface GyroCardProps {
  data: GyroData;
  history: GyroData[];
}

const GyroCard: React.FC<GyroCardProps> = ({ data, history }) => {
  const [showCharts, setShowCharts] = useState(false);

  // Calculate if there's dramatic movement based on gyro thresholds
  const isDramaticMovement = useCallback(() => {
    if (!data) return false;
    const threshold = 1000; // Same threshold as in Pi5 code
    const dx = Math.abs(data.gyroX);
    const dy = Math.abs(data.gyroY);
    const dz = Math.abs(data.gyroZ);
    return dx > threshold || dy > threshold || dz > threshold;
  }, [data]);

  // Show toast when dramatic movement is detected
  useEffect(() => {
    if (data && isDramaticMovement()) {
      toast(
        `⚠️ Dramatic Movement Detected!`,
        {
          duration: 5000, // 5 seconds
          icon: '🚨',
          style: {
            borderRadius: '10px',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #f87171',
            fontSize: '16px',
            fontWeight: '600',
          },
        }
      );
    }
  }, [data, isDramaticMovement]);

  // Add null check for data
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-800">Motion & Fall Detection</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const getMovementStatusColor = () => {
    return isDramaticMovement() ? 'text-red-500' : 'text-green-500';
  };

  const getMovementStatusText = () => {
    return isDramaticMovement() ? 'DRAMATIC MOVEMENT' : 'Normal Movement';
  };

  // Prepare chart data for accelerometer
  const accelChartData = history.slice(-20).map((item, index) => ({
    time: index,
    X: item.accelX,
    Y: item.accelY,
    Z: item.accelZ
  }));

  // Prepare chart data for gyroscope
  const gyroChartData = history.slice(-20).map((item, index) => ({
    time: index,
    X: item.gyroX,
    Y: item.gyroY,
    Z: item.gyroZ
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className={`w-6 h-6 ${getMovementStatusColor()}`} />
          <h3 className="text-xl font-semibold text-gray-800">Motion & Fall Detection</h3>
        </div>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
        >
          <span className="text-sm">Charts</span>
          {showCharts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        {/* Movement Status */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getMovementStatusColor()} mb-2`}>
            {isDramaticMovement() ? 'YES' : 'NO'}
          </div>
          <div className="text-lg text-gray-600 mb-1">Dramatic Movement</div>
          <div className={`text-sm font-medium ${getMovementStatusColor()}`}>
            {getMovementStatusText()}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Current Values */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Current Values:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium text-blue-600">X</div>
              <div className="text-gray-600">{data.accelX.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">Y</div>
              <div className="text-gray-600">{data.accelY.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-purple-600">Z</div>
              <div className="text-gray-600">{data.accelZ.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Movement Alert Banner */}
      {isDramaticMovement() && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">
              DRAMATIC MOVEMENT DETECTED! Please check on the patient immediately.
            </span>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {showCharts && (
        <div className="space-y-6">
          {/* Accelerometer Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-3">Accelerometer (X, Y, Z)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accelChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(2), 'Acceleration']}
                    labelFormatter={() => ''}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="X" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Y" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Z" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gyroscope Chart */}
          <div>
            <h4 className="text-lg font-medium text-gray-700 mb-3">Gyroscope (X, Y, Z)</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={gyroChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value: number) => [value.toFixed(2), 'Angular Velocity']}
                    labelFormatter={() => ''}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="X" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Y" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Z" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GyroCard;