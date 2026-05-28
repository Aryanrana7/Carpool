import React, { useContext, useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../../context/ThemeContext';

const buildDriverIcon = () => L.divIcon({
  html: `<div style="background:#10b981;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 16px rgba(16,185,129,0.5);font-size:18px;">🚗</div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const FlyToLocation = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo([position.lat, position.lng], 15, { animate: true, duration: 1.5 });
  }, [position?.lat, position?.lng]);
  return null;
};

const DriverLiveMap = ({ driverLocation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentPos, setCurrentPos] = useState(driverLocation);

  useEffect(() => {
    if (driverLocation) setCurrentPos(driverLocation);
  }, [driverLocation]);

  // Try browser geolocation if no socket location
  useEffect(() => {
    if (!driverLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const center = currentPos ? [currentPos.lat, currentPos.lng] : [12.9716, 77.5946];

  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-3xl border border-gray-100 dark:border-[#2a2a2a] h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#2a2a2a] flex-shrink-0">
        <div>
          <h2 className="text-base font-black text-gray-900 dark:text-white">Live Location</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">Your position updates in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${currentPos ? 'bg-emerald-400 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {currentPos ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={14}
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            key={isDarkMode ? 'dark' : 'light'}
            url={isDarkMode
              ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
              : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'}
            attribution='&copy; Carto'
          />
          {currentPos && (
            <>
              <FlyToLocation position={currentPos} />
              <Marker position={[currentPos.lat, currentPos.lng]} icon={buildDriverIcon()}>
                <Popup>You are here</Popup>
              </Marker>
            </>
          )}
        </MapContainer>
        {/* Accuracy ring overlay */}
        {currentPos && (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 dark:bg-[#1c1c1c]/90 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-[#2a2a2a]">
            📍 {currentPos.lat?.toFixed(4)}, {currentPos.lng?.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverLiveMap;
