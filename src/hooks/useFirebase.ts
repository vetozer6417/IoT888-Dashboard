import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';
import type { ElderlyDeviceData, Alert } from '../types';

const DEVICE_PATH = 'elderlyDevice1/history';
const ALERTS_PATH = 'alerts';

export const useFirebase = () => {
  const [deviceData, setDeviceData] = useState<ElderlyDeviceData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to device data changes
  useEffect(() => {
    const deviceRef = ref(database, DEVICE_PATH);
    console.log('🔍 Listening to Firebase path:', DEVICE_PATH);
    
    onValue(deviceRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📡 Firebase data received:', data);
      
      if (data) {
        // The data comes as an object with keys, we need to get the latest entry
        const dataKeys = Object.keys(data);
        console.log('🔑 Data keys found:', dataKeys);
        
        if (dataKeys.length > 0) {
          // Get the latest entry (last key)
          const latestKey = dataKeys[dataKeys.length - 1];
          const latestData = data[latestKey];
          console.log('📊 Latest data entry:', latestData);
          setDeviceData(latestData);
        } else {
          console.log('⚠️ No data keys found in snapshot');
          setDeviceData(null);
        }
      } else {
        console.log('⚠️ No data received from Firebase');
        setDeviceData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('❌ Error fetching device data:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => off(deviceRef);
  }, []);

  // Listen to alerts changes
  useEffect(() => {
    const alertsRef = ref(database, ALERTS_PATH);
    
    onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const alertsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setAlerts(alertsArray);
      } else {
        setAlerts([]);
      }
    }, (error) => {
      console.error('Error fetching alerts:', error);
    });

    return () => off(alertsRef);
  }, []);

  return {
    deviceData,
    alerts,
    loading,
    error
  };
};
