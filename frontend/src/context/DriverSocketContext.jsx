import React, { createContext, useEffect, useRef, useState, useContext } from 'react';
import { io } from 'socket.io-client';
import { DriverAuthContext } from './DriverAuthContext';

export const DriverSocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const DriverSocketProvider = ({ children }) => {
  const authContext = useContext(DriverAuthContext);
  const driver = authContext?.driver;
  const socketRef = useRef(null);
  const locationIntervalRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const stopTracking = () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
    setIsTracking(false);
  };

  useEffect(() => {
    if (!driver?._id) {
      stopTracking();
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      return undefined;
    }

    const instance = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = instance;
    setSocket(instance);

    instance.on('connect', () => {
      instance.emit('driver:register', { driverId: driver._id });
    });

    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
      instance.disconnect();
      socketRef.current = null;
      setSocket(null);
    };
  }, [driver?._id]);

  const startTracking = (bookingId, passengerId) => {
    if (!navigator.geolocation || !driver?._id) return;
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

  const emitRideStatus = (bookingId, passengerId, status) => {
    socketRef.current?.emit('driver:rideStatus', { bookingId, passengerId, status });
  };

  return (
    <DriverSocketContext.Provider value={{
      socket,
      isTracking,
      startTracking,
      stopTracking,
      emitRideStatus,
    }}>
      {children}
    </DriverSocketContext.Provider>
  );
};
