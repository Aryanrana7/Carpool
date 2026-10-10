import React, { useContext, useEffect, useState, memo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../../context/ThemeContext';
import { Navigation2, Crosshair, MapPin } from 'lucide-react';
import api from '../../services/api';

// Driver marker SVG divIcon
const buildDriverIcon = () =>
  L.divIcon({
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: #2563EB;
        border: 2.5px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45);
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

// Smoothly pan map on location update
const FlyToLocation = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.flyTo([position.lat, position.lng], 15, {
      animate: true,
      duration: 1.0,
    });
  }, [position, map]);

  return null;
};

const DriverLiveMap = ({ driverLocation }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [currentPos, setCurrentPos] = useState(driverLocation || null);
  const [placeName, setPlaceName] = useState('');

  useEffect(() => {
    if (driverLocation) {
      setCurrentPos(driverLocation);
    }
  }, [driverLocation]);

  useEffect(() => {
    if (driverLocation) return;
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.warn('Driver geolocation fallback:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [driverLocation]);

  // Reverse geocode to friendly landmark if coordinates exist
  useEffect(() => {
    let isMounted = true;
    if (!currentPos?.lat || !currentPos?.lng) return;

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/proxy/reverse', {
          params: { lat: currentPos.lat, lon: currentPos.lng },
        });
        if (isMounted && data?.address) {
          const parts = [
            data.address.road || data.address.suburb,
            data.address.city || data.address.town || data.address.county,
          ].filter(Boolean);
          if (parts.length > 0) {
            setPlaceName(parts.join(', '));
          }
        }
      } catch {
        // Graceful fallback to default status text
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [currentPos?.lat, currentPos?.lng]);

  const center = currentPos
    ? [currentPos.lat, currentPos.lng]
    : [30.7333, 76.7794];

  const tileUrl = isDarkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="bg-surface border border-border rounded-xl h-full flex flex-col overflow-hidden shadow-subtle">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <div>
          <h2 className="font-bold text-sm text-text-primary flex items-center gap-2">
            <Navigation2 size={16} className="text-primary" />
            Live Vehicle GPS
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Streaming real-time coordinates to assigned riders
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`w-2 h-2 rounded-full ${
              currentPos ? 'bg-success animate-pulse' : 'bg-border'
            }`}
          />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            {currentPos ? 'Broadcasting' : 'Standby'}
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="flex-1 relative min-h-0">
        <MapContainer
          center={center}
          zoom={14}
          className="w-full h-full"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            key={isDarkMode ? 'carto-dark' : 'carto-light'}
            url={tileUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />

          {currentPos && <FlyToLocation position={currentPos} />}

          {currentPos && (
            <Marker position={[currentPos.lat, currentPos.lng]} icon={buildDriverIcon()}>
              <Popup>
                <div className="p-1 text-center font-sans">
                  <p className="font-bold text-xs text-slate-900">Current Position</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {placeName || 'Live Location Active'}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Human-readable location / coordinates banner */}
        {currentPos && (
          <div className="absolute top-3 left-3 z-[400] bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium text-text-primary border border-border shadow-subtle flex items-center gap-2">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate max-w-[200px]">
              {placeName || 'Broadcasting live location'}
            </span>
            <span className="text-[10px] text-text-muted font-mono pl-1 border-l border-border">
              {currentPos.lat?.toFixed(4)}, {currentPos.lng?.toFixed(4)}
            </span>
          </div>
        )}

        {/* Waiting for geolocation fix */}
        {!currentPos && (
          <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none p-4">
            <div className="bg-surface/95 backdrop-blur-md px-6 py-4 rounded-xl border border-border shadow-overlay text-center">
              <Crosshair size={22} className="text-primary animate-spin mx-auto mb-2" />
              <p className="text-xs font-semibold text-text-primary">Acquiring GPS Fix…</p>
              <p className="text-[11px] text-text-muted mt-0.5">Please grant browser location permissions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DriverLiveMap);