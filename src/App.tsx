import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertTriangle, Database } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useFirebase } from './hooks/useFirebase';
import HeartbeatCard from './components/HeartbeatCard';
import GyroCard from './components/GyroCard';
import StatusIndicators from './components/StatusIndicators';
import type { HeartbeatData, GyroData } from './types';

function App() {
  const { 
    deviceData, 
    loading, 
    error
  } = useFirebase();

  const [heartbeatHistory, setHeartbeatHistory] = useState<HeartbeatData[]>([]);
  const [gyroHistory, setGyroHistory] = useState<GyroData[]>([]);

  // Update history when new data arrives
  useEffect(() => {
    if (deviceData?.heartbeat) {
      setHeartbeatHistory(prev => {
        const newHistory = [...prev, deviceData.heartbeat];
        return newHistory.slice(-50); // Keep last 50 readings
      });
    }
  }, [deviceData?.heartbeat]);

  useEffect(() => {
    if (deviceData?.gyro) {
      setGyroHistory(prev => {
        const newHistory = [...prev, deviceData.gyro];
        return newHistory.slice(-50); // Keep last 50 readings
      });
    }
  }, [deviceData?.gyro]);

  const currentData = deviceData;

  // Only show loading if we're actually loading AND have no data
  if (loading && !deviceData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Only show error if we have an error AND no data
  if (error && !deviceData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please check your Firebase configuration and internet connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between h-16 py-2 sm:py-0">
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IoT</span>
              </div>
              <h1 className="text-base lg:text-lg font-semibold text-gray-800">Elderly Care Dashboard</h1>
            </div>
            <div className="flex flex-row items-start justify-between md:justify-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm">
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-xs sm:text-sm">Live Data</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                Last updated: {currentData?.lastUpdated ? new Date(currentData.lastUpdated).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Firebase Connection Status */}
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm sm:text-base text-blue-700 font-medium mb-1">
                Firebase Connection Status
              </div>
              <div className="text-xs sm:text-sm text-blue-600">
                {deviceData ? (
                  <>
                    ✅ Connected to Firebase | 
                    Data Path: elderlyDevice1/history | 
                    Last Update: {new Date(deviceData.lastUpdated).toLocaleString()}
                  </>
                ) : (
                  <>
                    ⚠️ No data received from Firebase | 
                    Data Path: elderlyDevice1/history | 
                    Check if Pi5 is sending data
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Heartbeat Card - Only show if data exists */}
          {currentData?.heartbeat && (
            <HeartbeatCard 
              data={currentData.heartbeat} 
              history={heartbeatHistory}
            />
          )}

          {/* Gyro Card - Only show if data exists */}
          {currentData?.gyro && (
            <GyroCard 
              data={currentData.gyro} 
              history={gyroHistory}
            />
          )}

          {/* Show message if no sensor cards available */}
          {(!currentData?.heartbeat && !currentData?.gyro) && (
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Sensor Data Available</h3>
              <p className="text-gray-600 mb-4">
                Heartbeat and Gyro sensors are not sending data yet.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>• Check if your Pi5 device is running and connected to the internet</p>
                <p>• Verify Firebase configuration in your Pi5 code</p>
                <p>• Check browser console for any error messages</p>
                <p>• Data path: <code className="bg-gray-100 px-2 py-1 rounded">elderlyDevice1/history</code></p>
              </div>
            </div>
          )}
        </div>

        {/* Status Indicators - Only show if knock data exists */}
        {currentData?.knock && (
          <div className="mb-6 sm:mb-8">
            <StatusIndicators 
              knock={currentData.knock}
            />
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}

export default App;
