import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD_rxjUiOJ019kxTyZc5pURjB9BX51sTvs",
  authDomain: "iot888-chula.firebaseapp.com",
  databaseURL: "https://iot888-chula-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot888-chula",
  storageBucket: "iot888-chula.firebasestorage.app",
  messagingSenderId: "241305376745",
  appId: "1:241305376745:web:42c32c9fd1fdefdd981d78",
  measurementId: "G-7GXCFG6E3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;
