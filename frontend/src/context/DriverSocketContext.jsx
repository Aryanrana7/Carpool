import React, { createContext, useEffect, useRef, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { DriverAuthContext } from './DriverAuthContext';

export const DriverSocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const DriverSocketProvider = ({ children }) => {
  const authContext = useContext(DriverAuthContext);
  const driver = authContext?.driver;
  const socketRef = useRef(null);
  const locationIntervalRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      if (driver?._id) {
        socketRef.current.emit('driver:register', { driverId: driver._id });
      }
    });

    return () => {
      stopTracking();
      socketRef.current?.disconnect();
    };
  }, [driver?._id]);

  /**
   * Start emitting GPS location every 3 seconds for an active booking
   */
  const startTracking = (bookingId, passengerId) => {
    if (!navigator.geolocation) return;
    setIsTracking(true);

    locationIntervalRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          socketRef.current?.emit('driver:locationUpdate', {
            driverId: driver._id,
            lat,
            lng,
            bookingId,
            passengerId,
          });
        },
        (err) => console.warn('Geolocation error:', err),
        { enableHighAccuracy: true, timeout: 3000 }
      );
    }, 3000);
  };

  const stopTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    setIsTracking(false);
  };

  /**
   * Emit a ride status update to the passenger
   */
  const emitRideStatus = (bookingId, passengerId, status) => {
    socketRef.current?.emit('driver:rideStatus', { bookingId, passengerId, status });
  };

  return (
    <DriverSocketContext.Provider value={{
      socket: socketRef.current,
      isTracking,
      startTracking,
      stopTracking,
      emitRideStatus,
    }}>
      {children}
    </DriverSocketContext.Provider>
  );
};
