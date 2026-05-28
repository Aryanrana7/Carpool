import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const socketRef = useRef(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      // Register user socket if logged in
      if (user?._id) {
        socketRef.current.emit('user:register', { userId: user._id });
      }
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for driver location updates
    socketRef.current.on('driver:locationUpdate', ({ lat, lng, driverId }) => {
      setDriverLocation({ lat, lng, driverId, timestamp: Date.now() });
    });

    // Listen for ride status changes (accepted, started, completed)
    socketRef.current.on('ride:statusUpdate', ({ bookingId, status }) => {
      setRideStatus({ bookingId, status, timestamp: Date.now() });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current,
      isConnected,
      driverLocation,
      rideStatus,
      setRideStatus,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
