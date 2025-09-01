# IoT888 Elderly Care Dashboard

A comprehensive real-time monitoring dashboard for elderly care IoT devices, built with React, TypeScript, and Firebase Realtime Database.

## 🚀 Features

### Real-time Data Display
- **Heartbeat Monitor (KY-039)**: Displays BPM with line charts and alerts for abnormal values (<50 or >120)
- **Motion & Fall Detection (MPU-6050)**: Shows fall detection status with optional X/Y/Z axis charts
- **Knock Sensor (KY-031)**: Real-time knock detection status
- **SOS Button (KY-004)**: Emergency button status with popup alerts
- **Buzzer (KY-006)**: Current buzzer status and remote control

### Control Panel
- **Buzzer Control**: Activate/deactivate buzzer remotely
- **Alert Management**: Reset all active alerts
- **Real-time Updates**: All changes sent to Firebase instantly

### Data Logging & History
- **Comprehensive Logging**: All sensor data stored with timestamps
- **History Table**: View historical data with filtering and sorting
- **Export Functionality**: Download alert history as CSV
- **Alert Management**: Acknowledge and track alert status

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Database**: Firebase Realtime Database
- **State Management**: React Hooks

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IoT888_Dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Realtime Database
   - Copy your Firebase config to `src/firebase.ts`

4. **Update Firebase Configuration**
   ```typescript
   // src/firebase.ts
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL", // Important for Realtime Database
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 🔧 Firebase Database Structure

The dashboard expects the following Firebase Realtime Database structure:

```json
{
  "elderlyDevice1": {
    "heartbeat": {
      "value": 78,
      "status": "normal",
      "timestamp": "2025-08-31T14:25:00Z"
    },
    "gyro": {
      "accelX": -0.12,
      "accelY": 0.98,
      "accelZ": 0.05,
      "gyroX": 0.01,
      "gyroY": -0.02,
      "gyroZ": 0.03,
      "fallDetected": false,
      "timestamp": "2025-08-31T14:25:00Z"
    },
    "knock": {
      "detected": false,
      "timestamp": "2025-08-31T14:25:00Z"
    },
    "sosButton": {
      "pressed": false,
      "timestamp": "2025-08-31T14:25:00Z"
    },
    "buzzer": {
      "status": "OFF",
      "timestamp": "2025-08-31T14:25:00Z"
    },
    "lastUpdated": "2025-08-31T14:25:00Z"
  },
  "alerts": {
    "alert1": {
      "id": "alert1",
      "type": "heartbeat",
      "message": "Heart rate is too high (125 BPM)",
      "severity": "high",
      "timestamp": "2025-08-31T14:25:00Z",
      "acknowledged": false
    }
  }
}
```

## 📱 Dashboard Components

### HeartbeatCard
- Real-time BPM display with color-coded status
- Line chart showing heart rate trends
- Automatic alerts for abnormal values
- Historical data visualization

### GyroCard
- Fall detection status (YES/NO)
- Current accelerometer and gyroscope values
- Optional X/Y/Z axis charts for debugging
- Collapsible chart section

### StatusIndicators
- Knock sensor status
- SOS button status
- Buzzer current state
- Alert banners for active events

### ControlPanel
- Buzzer ON/OFF control
- Alert reset functionality
- Confirmation dialogs for safety
- Loading states for operations

### HistoryLog
- Comprehensive alert history
- Filtering by alert type
- Sorting by timestamp or severity
- CSV export functionality
- Summary statistics

## 🚨 Alert System

The dashboard includes a comprehensive alert system:

- **Heartbeat Alerts**: Triggered when BPM < 50 or > 120
- **Fall Detection**: Immediate alerts when falls are detected
- **Knock Detection**: Notifications when knocks are detected
- **SOS Button**: Emergency alerts when SOS is pressed
- **Alert Management**: Acknowledge and reset alerts

## 🔌 IoT Device Integration

### Required Sensors
- **KY-039**: Heartbeat sensor
- **MPU-6050**: Accelerometer/Gyroscope for fall detection
- **KY-031**: Knock sensor
- **KY-004**: SOS button
- **KY-006**: Buzzer

### Data Flow
1. Sensors collect data on ESP32
2. ESP32 sends data to Raspberry Pi 5
3. Pi 5 processes and uploads to Firebase
4. Dashboard displays real-time data
5. Dashboard can control buzzer via Firebase

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data without page refresh
- **Color-coded Status**: Intuitive visual indicators
- **Loading States**: Smooth user experience
- **Error Handling**: Graceful error display
- **Demo Mode**: Works without Firebase connection

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Deploy to Firebase Hosting
```bash
pnpm add -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔒 Security Considerations

- Configure Firebase Security Rules for your Realtime Database
- Implement authentication if needed
- Use environment variables for sensitive configuration
- Regular security updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the Firebase configuration
- Verify network connectivity
- Review browser console for errors
- Ensure Firebase Realtime Database rules allow read/write access

---

**Note**: This dashboard is designed for elderly care monitoring. Always ensure proper medical supervision and emergency protocols are in place.
