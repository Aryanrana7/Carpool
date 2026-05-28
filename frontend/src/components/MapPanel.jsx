import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../context/ThemeContext';
import { SocketContext } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'lucide-react';

// Custom car SVG icon with hover scaling / bounce animations
const buildCarIcon = (color = '#6366f1', animate = false) => L.divIcon({
  html: `<div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;transition:transform 0.3s ease;" class="hover:scale-125 ${animate ? 'animate-pulse' : ''}">
    <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
      <circle cx="18" cy="18" r="18" fill="${color}" opacity="0.2"/>
      <circle cx="18" cy="18" r="12" fill="${color}"/>
      <text y="23" x="18" text-anchor="middle" font-size="13">🚗</text>
    </svg>
  </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Premium custom pins for pickup and dropoff
const buildPinIcon = (color = '#6366f1', label = 'PICKUP') => L.divIcon({
  html: `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;" class="group">
    <div style="background:${color};color:#fff;font-size:9px;font-weight:900;letter-spacing:0.05em;padding:4px 8px;border-radius:10px;box-shadow:0 8px 16px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.2);transform:scale(1);transition:transform 0.2s;" class="group-hover:scale-110">
      ${label}
    </div>
    <div style="width:2px;height:6px;background:${color};opacity:0.8;"></div>
    <div style="width:6px;height:6px;background:${color};border-radius:50%;box-shadow:0 0 8px ${color};"></div>
  </div>`,
  className: '',
  iconSize: [60, 40],
  iconAnchor: [30, 36],
});

// Dynamically changes bounds with side panel safe-area padding
const ChangeView = ({ bounds, showDrawer }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        paddingTopLeft: [60, 60],
        paddingBottomRight: showDrawer ? [400, 80] : [60, 60],
        maxZoom: 15,
        animate: true,
        duration: 0.5
      });
    }
  }, [bounds, map, showDrawer]);
  return null;
};

// Ambient simulated driver markers moving softly
const SimulatedCars = React.memo(({ center, selectedRide }) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    if (!center) return;
    // Generate simulated cars around center
    const newCars = Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      lat: center.lat + (Math.random() - 0.5) * 0.025,
      lng: center.lng + (Math.random() - 0.5) * 0.025,
      isTarget: selectedRide && i === 0
    }));
    setCars(newCars);

    const interval = setInterval(() => {
      setCars(prev => prev.map(car => ({
        ...car,
        lat: car.lat + (Math.random() - 0.5) * 0.0004,
        lng: car.lng + (Math.random() - 0.5) * 0.0004,
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, [center?.lat, center?.lng, selectedRide?._id]);

  return (
    <>
      {cars.map(car => (
        <Marker
          key={car.id}
          position={[car.lat, car.lng]}
          icon={buildCarIcon(car.isTarget ? '#6366f1' : '#6b7280', car.isTarget)}
        />
      ))}
    </>
  );
});

const MapPanel = ({ source, destination, routePoints, distance, duration, hasSearched, hoveredRide, selectedRide, showDrawer }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { driverLocation, rideStatus } = useContext(SocketContext);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (routePoints?.length > 0) {
      const latLngs = routePoints.map(c => L.latLng(c[0], c[1]));
      setBounds(L.latLngBounds(latLngs));
    } else if (source && destination) {
      setBounds(L.latLngBounds([source, destination]));
    } else if (source) {
      const p = L.latLng(source.lat, source.lng);
      setBounds(L.latLngBounds([p, p]));
    }
  }, [routePoints, source, destination]);

  // Consistent accent color: Indigo (#6366f1)
  const polylineColor = hoveredRide || selectedRide ? '#6366f1' : '#818cf8';
  const polylineWeight = hoveredRide || selectedRide ? 7 : 5;

  return (
    <div className="w-full h-full relative z-0 overflow-hidden bg-[#0c0c0c]">
      <MapContainer 
        center={source ? [source.lat, source.lng] : [12.9716, 77.5946]}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          url={isDarkMode
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'}
          attribution='&copy; <a href="https://carto.com/">Carto</a>'
        />
        <ChangeView bounds={bounds} showDrawer={showDrawer} />

        {/* Simulated ambient cars */}
        <SimulatedCars center={source || { lat: 12.9716, lng: 77.5946 }} selectedRide={selectedRide} />

        {source && <Marker position={[source.lat, source.lng]} icon={buildPinIcon('#6366f1', 'PICKUP')} />}
        {destination && <Marker position={[destination.lat, destination.lng]} icon={buildPinIcon('#8b5cf6', 'DROPOFF')} />}
        
        {routePoints?.length > 0 && (
          <Polyline positions={routePoints} color={polylineColor} weight={polylineWeight} opacity={0.85} />
        )}

        {/* 🔴 Live driver marker from socket */}
        {driverLocation && (
          <Marker
            position={[driverLocation.lat, driverLocation.lng]}
            icon={buildCarIcon('#6366f1', true)}
          >
            <Popup>Your driver is here!</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Subtle screen dimming overlay when drawer opens */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-[200] pointer-events-none"
            style={{ background: 'radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)' }}
          />
        )}
      </AnimatePresence>

      {/* Floating Route Info Header */}
      {distance && duration && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="absolute top-5 right-5 z-[400] flex items-center gap-5 px-6 py-4 rounded-2xl shadow-2xl shadow-black/40 border border-white/10"
          style={{ background: 'rgba(12,12,12,0.85)', backdropFilter: 'blur(20px) saturate(1.4)' }}
        >
          <div className="text-center">
            <p className="font-black text-white/30 text-[9px] uppercase tracking-[0.15em] mb-0.5">Distance</p>
            <p className="font-black text-white text-lg leading-tight">{distance}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="font-black text-white/30 text-[9px] uppercase tracking-[0.15em] mb-0.5">Est. Time</p>
            <p className="font-black text-white text-lg leading-tight">{duration}</p>
          </div>
        </motion.div>
      )}

      {/* Live ride status banner from socket */}
      <AnimatePresence>
        {rideStatus && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-indigo-600 text-white px-8 py-3 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center space-x-3 font-bold text-sm border border-white/10"
          >
            <Navigation size={18} className="animate-pulse flex-shrink-0" />
            <span>
              {rideStatus.status === 'confirmed' && '✅ Driver Accepted — On the way!'}
              {rideStatus.status === 'in_progress' && '🚗 Your ride has started!'}
              {rideStatus.status === 'completed' && '🎉 Ride Completed!'}
              {rideStatus.status === 'rejected' && '❌ Booking was rejected'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPanel;
