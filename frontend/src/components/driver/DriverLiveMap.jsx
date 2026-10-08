import React, { useContext, useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../../context/ThemeContext';

// Driver marker icon
const buildDriverIcon = () =>
  L.divIcon({
    html: `
      <div
        style="
          background:#10b981;
          width:40px;
          height:40px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:3px solid white;
          box-shadow:0 4px 16px rgba(16,185,129,0.5);
          font-size:18px;
        "
      >
        🚗
      </div>
    `,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

// Automatically move map when driver location changes
const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(
      [position.lat, position.lng],
      15,
      {
        animate: true,
        duration: 1.5,
      }
    );
  }, [position, map]);

  return null;
};

const DriverLiveMap = ({ driverLocation }) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [currentPos, setCurrentPos] = useState(driverLocation || null);

  // Update position whenever socket sends a new location
  useEffect(() => {
    if (driverLocation) {
      setCurrentPos(driverLocation);
    }
  }, [driverLocation]);

  // Use browser GPS if socket location isn't available
  useEffect(() => {
    if (driverLocation) return;

    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.log('Geolocation unavailable:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [driverLocation]);

  // Default location if GPS/socket isn't available
  const center = currentPos
    ? [currentPos.lat, currentPos.lng]
    : [30.7333, 76.7794]; // Chandigarh

  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-3xl border border-gray-100 dark:border-[#2a2a2a] h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#2a2a2a] flex-shrink-0">

        <div>
          <h2 className="text-base font-black text-gray-900 dark:text-white">
            Live Location
          </h2>

          <p className="text-[10px] text-gray-400 mt-0.5">
            Your position updates in real-time
          </p>
        </div>

        <div className="flex items-center space-x-2">

          <div
            className={`w-2 h-2 rounded-full ${
              currentPos
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-gray-300'
            }`}
          />

          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            {currentPos ? 'Live' : 'Offline'}
          </span>

        </div>

      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">

        <MapContainer
          center={center}
          zoom={14}
          className="w-full h-full"
          zoomControl={true}
          scrollWheelZoom={true}
        >

          {/* OpenStreetMap
              No API key required
          */}
          <TileLayer
            key={isDarkMode ? 'dark' : 'light'}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Move map to driver's current position */}
          {currentPos && (
            <FlyToLocation position={currentPos} />
          )}

          {/* Driver marker */}
          {currentPos && (
            <Marker
              position={[
                currentPos.lat,
                currentPos.lng,
              ]}
              icon={buildDriverIcon()}
            >
              <Popup>
                <div style={{ textAlign: 'center' }}>
                  <strong>🚗 You are here</strong>
                  <br />
                  <span style={{ fontSize: '12px' }}>
                    Live driver location
                  </span>
                </div>
              </Popup>
            </Marker>
          )}

        </MapContainer>

        {/* Location coordinates */}
        {currentPos && (
          <div
            className="
              absolute
              bottom-4
              left-4
              z-[1000]
              bg-white/90
              dark:bg-[#1c1c1c]/90
              backdrop-blur-sm
              px-4
              py-2
              rounded-xl
              text-xs
              font-bold
              text-gray-700
              dark:text-gray-300
              border
              border-gray-100
              dark:border-[#2a2a2a]
              shadow-lg
            "
          >
            📍 {currentPos.lat?.toFixed(4)}, {currentPos.lng?.toFixed(4)}
          </div>
        )}

        {/* Waiting for location */}
        {!currentPos && (
          <div
            className="
              absolute
              inset-0
              z-[900]
              flex
              items-center
              justify-center
              pointer-events-none
            "
          >
            <div
              className="
                bg-white/95
                dark:bg-[#1c1c1c]/95
                backdrop-blur-sm
                px-6
                py-4
                rounded-2xl
                shadow-xl
                border
                border-gray-100
                dark:border-[#2a2a2a]
                text-center
              "
            >
              <div className="text-2xl mb-2">
                📍
              </div>

              <p className="text-sm font-bold text-gray-800 dark:text-white">
                Getting your location...
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Please allow location access
              </p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default DriverLiveMap;