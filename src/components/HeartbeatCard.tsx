import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Heart, AlertTriangle } from 'lucide-react';
import type { HeartbeatData } from '../types';

interface HeartbeatCardProps {
  data: HeartbeatData;
  history: HeartbeatData[];
}

const HeartbeatCard: React.FC<HeartbeatCardProps> = ({ data, history }) => {
  const [isAlert, setIsAlert] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  // Convert KY-039 raw sensor values to BPM
  // Raw range: 2500-4000, Target BPM range: 60-100
  const convertRawToBPM = (rawValue: number): number => {
    // KY-039 sensor characteristics - adjusted based on your observations
    const BASELINE_RAW = 2500;  // Baseline when not touched (should be close to 0 BPM)
    const MAX_RAW = 4000;       // Maximum raw sensor value when touched
    const MIN_BPM = 0;          // Minimum BPM (no touch)
    const MAX_BPM = 100;        // Maximum BPM (normal touch)
    
    // If value is close to baseline, consider it as no touch
    const BASELINE_THRESHOLD = 100; // Allow some variation around baseline
    
    if (Math.abs(rawValue - BASELINE_RAW) <= BASELINE_THRESHOLD) {
      return 0; // No touch detected
    }
    
    // Linear mapping formula for touch detection
    // BPM = MIN_BPM + (raw - BASELINE_RAW) * (MAX_BPM - MIN_BPM) / (MAX_RAW - BASELINE_RAW)
    const bpm = MIN_BPM + (rawValue - BASELINE_RAW) * (MAX_BPM - MIN_BPM) / (MAX_RAW - BASELINE_RAW);
    
    // Clamp values to reasonable range
    return Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(bpm)));
  };

  // Get converted BPM value
  const actualBPM = convertRawToBPM(data?.filtered || 0);

  useEffect(() => {
    if (data?.filtered) {
      setIsAlert(actualBPM < 50 || actualBPM > 120);
      setIsTouched(actualBPM > 0);
    }
  }, [data?.filtered, actualBPM]);

  // Add null check for data
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="w-6 h-6 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-800">Heart Rate Monitor</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (actualBPM < 50) return 'text-red-500';
    if (actualBPM > 120) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (actualBPM < 50) return 'Low Heart Rate';
    if (actualBPM > 120) return 'High Heart Rate';
    return 'Normal';
  };

  // Prepare chart data with converted BPM values
  const chartData = history.slice(-20).map((item, index) => ({
    time: index,
    bpm: convertRawToBPM(item.filtered)
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Heart className={`w-6 h-6 ${getStatusColor()}`} />
          <h3 className="text-xl font-semibold text-gray-800">Heart Rate Monitor</h3>
        </div>
        {isAlert && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">Alert</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BPM Display */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${isTouched ? getStatusColor() : 'text-gray-400'} mb-2`}>
            {isTouched ? actualBPM : '--'}
          </div>
          <div className="text-lg text-gray-600 mb-1">BPM</div>
          <div className={`text-sm font-medium ${isTouched ? getStatusColor() : 'text-gray-400'}`}>
            {isTouched ? getStatusText() : 'No Touch Detected'}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Raw: {data.filtered} | Converted: {actualBPM} BPM
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {/* Line Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="time" 
                tick={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 200]}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} BPM`, 'Heart Rate']}
                labelFormatter={() => ''}
              />
              <Line 
                type="monotone" 
                dataKey="bpm" 
                stroke={isTouched ? (isAlert ? "#ef4444" : "#10b981") : "#9ca3af"} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Sensor Information */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700">
            <div className="font-medium mb-1">KY-039 Heart Rate Sensor</div>
            <div className="text-xs space-y-1">
              <div>• Raw sensor output: {data.filtered}</div>
              <div>• Touch detected: {isTouched ? '✅ Yes' : '❌ No'}</div>
              <div>• Converted BPM: {isTouched ? actualBPM : '0 (No Touch)'}</div>
              <div>• Baseline threshold: ±{100} around {2500}</div>
              <div>• Conversion: {data.filtered} → {actualBPM} BPM</div>
            </div>
          </div>
        </div>

        {/* Touch Status Indicator */}
        <div className={`p-3 rounded-lg border ${
          isTouched 
            ? 'bg-green-50 border-green-200' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className={`text-sm font-medium ${
            isTouched ? 'text-green-700' : 'text-gray-600'
          }`}>
            <div className="flex items-center space-x-2">
              <span>{isTouched ? '🖐️' : '👆'}</span>
              <span>
                {isTouched 
                  ? `Sensor Active - Heart Rate: ${actualBPM} BPM`
                  : 'No Touch Detected - Place finger on sensor'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {isAlert && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">
              {actualBPM < 50 
                ? `Heart rate is too low (${actualBPM} BPM). Please check on the patient.`
                : `Heart rate is too high (${actualBPM} BPM). Please check on the patient.`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeartbeatCard;