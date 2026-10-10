import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

export const SocketProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const token = authContext?.token;
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user?._id || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      return undefined;
    }

    const instance = io(SOCKET_URL, { transports: ['websocket'], auth: { token } });
    socketRef.current = instance;
    setSocket(instance);

    instance.on('connect', () => {
      setIsConnected(true);
    });

    instance.on('disconnect', () => {
      setIsConnected(false);
    });

    instance.on('driver:locationUpdate', ({ lat, lng, driverId, requestId, bookingId }) => {
      setDriverLocation({ lat, lng, driverId, requestId, bookingId, timestamp: Date.now() });
    });

    instance.on('ride:statusUpdate', ({ bookingId, status }) => {
      setRideStatus({ bookingId, status, timestamp: Date.now() });
    });

    instance.on('request:driverAssigned', (payload) => {
      setOnDemandAssignment({ ...payload, timestamp: Date.now() });
    });

    instance.on('request:statusUpdate', (payload) => {
      setOnDemandStatus({ ...payload, timestamp: Date.now() });
    });

    return () => {
      instance.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [user?._id, token]);

  const [onDemandAssignment, setOnDemandAssignment] = useState(null);
  const [onDemandStatus, setOnDemandStatus] = useState(null);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      driverLocation,
      rideStatus,
      setRideStatus,
      onDemandAssignment,
      setOnDemandAssignment,
      onDemandStatus,
      setOnDemandStatus,
    }}>
      {children}
    </SocketContext.Provider>
  );
};
