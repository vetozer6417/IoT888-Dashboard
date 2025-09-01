export interface HeartbeatData {
  filtered: number;
  timestamp: number;
}

export interface GyroData {
  accelX: number;
  accelY: number;
  accelZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  timestamp: number;
}

export interface KnockData {
  count: number;
  detected: boolean;
  timestamp: number;
}

export interface ElderlyDeviceData {
  heartbeat: HeartbeatData;
  gyro: GyroData;
  knock: KnockData;
  lastUpdated: number;
}

export interface Alert {
  id: string;
  type: 'heartbeat' | 'motion' | 'knock';
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  acknowledged: boolean;
}
