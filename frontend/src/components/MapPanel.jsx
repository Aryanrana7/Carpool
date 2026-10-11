import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import { ThemeContext } from '../context/ThemeContext';
import { SocketContext } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Crosshair, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

// Clean SVG Car Marker (No emojis)
const buildCarIcon = (color = '#087F5B', isSelected = false) => {
  const size = isSelected ? 42 : 36;
  return L.divIcon({
    html: `
      <div
        style="
          width:${size}px;
          height:${size}px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:${color};
          color:#ffffff;
          border:2.5px solid #ffffff;
          border-radius:50%;
          box-shadow:0 6px 16px rgba(24,36,31,0.3);
          transition:transform 0.15s ease;
        "
        class="${isSelected ? 'scale-110 ring-4 ring-emerald-500/30' : ''}"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2"/>
          <circle cx="7" cy="17" r="2"/>
          <path d="M9 17h6"/>
          <circle cx="17" cy="17" r="2"/>
        </svg>
      </div>
    `,
    className: 'custom-car-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Route Pin Icons (Pickup & Dropoff)
const buildPinIcon = (color = '#087F5B', label = 'PICKUP') =>
  L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div
          style="
            background:${color};
            color:#ffffff;
            font-size:10px;
            font-weight:700;
            letter-spacing:0.04em;
            padding:3px 7px;
            border-radius:6px;
            box-shadow:0 4px 12px rgba(24,36,31,0.25);
            border:1.5px solid #ffffff;
            white-space:nowrap;
          "
        >
          ${label}
        </div>
        <div style="width:2px;height:4px;background:${color};"></div>
        <div style="width:6px;height:6px;background:${color};border-radius:50%;box-shadow:0 0 6px ${color};"></div>
      </div>
    `,
    className: 'custom-pin-marker',
    iconSize: [56, 34],
    iconAnchor: [28, 30],
  });

// Soft Pulsing Radar Marker for Passenger Location
const buildPassengerLocationIcon = () =>
  L.divIcon({
    html: `
      <div style="position:relative;width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        <span style="position:absolute;width:28px;height:28px;border-radius:50%;background:#087F5B;opacity:0.25;" class="animate-ping"></span>
        <div style="width:12px;height:12px;border-radius:50%;background:#087F5B;border:2.5px solid #ffffff;box-shadow:0 2px 8px rgba(8,127,91,0.6);z-index:2;"></div>
      </div>
    `,
    className: 'custom-passenger-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

// Auto-fit bounds helper
const ChangeView = ({ bounds, showDrawer }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, {
        paddingTopLeft: [70, 70],
        paddingBottomRight: showDrawer ? [420, 90] : [70, 70],
        maxZoom: 15,
        animate: true,
        duration: 0.6,
      });
    }
  }, [bounds, map, showDrawer]);

  return null;
};

// Smooth Map Recenter
const MapFlyTo = ({ targetCoords, trigger }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords?.lat && targetCoords?.lng && trigger > 0) {
      map.flyTo([targetCoords.lat, targetCoords.lng], 14, {
        animate: true,
        duration: 0.8,
      });
    }
  }, [targetCoords, trigger, map]);
  return null;
};

// Ensure Leaflet recalculates dimensions when container resizes
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
};

export const MapPanel = ({
  source,
  destination,
  routePoints,
  distance,
  duration,
  hasSearched,
  rides = [],
  hoveredRide,
  selectedRide,
  onSelectRide,
  showDrawer,
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { driverLocation, rideStatus } = useContext(SocketContext);
  const [bounds, setBounds] = useState(null);

  // Passenger live GPS state
  const [passengerLocation, setPassengerLocation] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle');
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const requestPassengerLocation = useCallback((shouldFly = false) => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      if (shouldFly) toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGeoStatus('prompting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setPassengerLocation(coords);
        setGeoStatus('granted');
        if (shouldFly) setRecenterTrigger((prev) => prev + 1);
      },
      (err) => {
        if (err.code === 1) {
          setGeoStatus('denied');
          if (shouldFly) toast.error('Location permission was denied');
        } else {
          setGeoStatus('unavailable');
          if (shouldFly) toast.error('Unable to determine current location');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          requestPassengerLocation(false);
        }
      }).catch(() => {});
    }
  }, [requestPassengerLocation]);

  useEffect(() => {
    if (routePoints?.length > 0) {
      const latLngs = routePoints.map((c) => L.latLng(c[0], c[1]));
      setBounds(L.latLngBounds(latLngs));
    } else if (source && destination && source.lat && destination.lat) {
      setBounds(L.latLngBounds([source, destination]));
    } else if (source && source.lat) {
      const p = L.latLng(source.lat, source.lng);
      setBounds(L.latLngBounds([p, p]));
    }
  }, [routePoints, source, destination]);

  // OpenStreetMap tile URL with muted filter applied via .leaflet-tile-pane
  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div className="w-full h-full relative z-0 overflow-hidden bg-background isolate">
      <MapContainer
        center={
          source && source.lat
            ? [source.lat, source.lng]
            : [30.7333, 76.7794]
        }
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          key={isDarkMode ? 'dark' : 'light'}
          url={tileUrl}
          attribution={tileAttribution}
          maxZoom={19}
        />

        <ChangeView bounds={bounds} showDrawer={showDrawer} />
        <MapResizeHandler />
        <MapFlyTo targetCoords={passengerLocation} trigger={recenterTrigger} />

        {/* Passenger Location Marker */}
        {passengerLocation && (
          <Marker
            position={[passengerLocation.lat, passengerLocation.lng]}
            icon={buildPassengerLocationIcon()}
          >
            <Popup>
              <div className="text-center py-1">
                <span className="text-xs font-semibold text-primary block">Your Location</span>
                <span className="text-[11px] text-text-secondary">GPS signal active</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pickup Pin */}
        {source && source.lat && (
          <Marker
            position={[source.lat, source.lng]}
            icon={buildPinIcon('#087F5B', 'PICKUP')}
          />
        )}

        {/* Dropoff Pin */}
        {destination && destination.lat && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={buildPinIcon('#18241F', 'DROPOFF')}
          />
        )}

        {/* Route Polyline with Forest Charcoal Casing & Vibrant Emerald Core */}
        {routePoints?.length > 0 && (
          <>
            {/* Casing line */}
            <Polyline
              positions={routePoints}
              color={isDarkMode ? '#0F1714' : '#18241F'}
              weight={7}
              opacity={0.8}
            />
            {/* Core route line */}
            <Polyline
              positions={routePoints}
              color="#087F5B"
              weight={4}
              opacity={0.95}
            />
          </>
        )}

        {/* Real Matching Rides Markers */}
        {hasSearched &&
          rides.map((ride) => {
            const coords =
              ride.sourceCoords?.lat && ride.sourceCoords?.lng
                ? [ride.sourceCoords.lat, ride.sourceCoords.lng]
                : source && source.lat
                ? [source.lat, source.lng]
                : null;

            if (!coords) return null;

            const isSelected = selectedRide?._id === ride._id;
            const isHovered = hoveredRide?._id === ride._id;

            return (
              <Marker
                key={ride._id}
                position={coords}
                icon={buildCarIcon(isSelected || isHovered ? '#05513A' : '#087F5B', isSelected)}
                eventHandlers={{
                  click: () => onSelectRide && onSelectRide(ride),
                }}
              >
                <Popup>
                  <div className="text-center p-1 font-sans">
                    <p className="text-xs font-semibold text-text-primary">
                      {ride.driver?.name || 'Driver'}
                    </p>
                    <p className="text-sm font-bold text-primary tabular-nums mt-0.5">
                      {formatCurrency(ride.price)} · {ride.seats} seat{ride.seats !== 1 ? 's' : ''} left
                    </p>
                    {ride.carType && (
                      <p className="text-[11px] text-text-secondary mt-0.5">
                        {ride.carType}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Live Driver Marker from Socket */}
        {driverLocation && (
          <Marker
            position={[driverLocation.lat, driverLocation.lng]}
            icon={buildCarIcon('#16A34A', true)}
          >
            <Popup>
              <div className="text-center py-1">
                <span className="text-xs font-semibold text-success block">Assigned Driver</span>
                <span className="text-[11px] text-text-secondary">En route</span>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Recenter / My Location Floating Action */}
      <button
        type="button"
        onClick={() => requestPassengerLocation(true)}
        aria-label="Center map on my location"
        title="Center map on my location"
        className="
          absolute bottom-20 sm:bottom-6 right-3.5 sm:right-6 z-[400] px-3 py-2 sm:px-3.5 sm:py-2.5
          rounded-md bg-surface border border-border shadow-card flex items-center gap-2
          text-xs font-semibold text-text-primary hover:text-primary hover:border-primary/40
          transition-all active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        "
      >
        <Crosshair
          size={16}
          className={`text-primary ${
            geoStatus === 'prompting' ? 'animate-spin' : 'group-hover:rotate-45'
          } transition-transform`}
        />
        <span className="hidden xs:inline sm:inline">My Location</span>
      </button>

      {/* Route Distance & Time Floating Pill */}
      {distance && duration && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-5 right-5 z-[400] hidden sm:flex items-center gap-4 px-4 py-2.5 rounded-md bg-surface border border-border shadow-card"
        >
          <div className="text-center">
            <p className="micro-label">Distance</p>
            <p className="font-bold text-text-primary text-sm tabular-nums">{distance}</p>
          </div>
          <div className="w-px h-6 bg-border" />
          <div className="text-center">
            <p className="micro-label">Est. Time</p>
            <p className="font-bold text-text-primary text-sm tabular-nums">{duration}</p>
          </div>
        </motion.div>
      )}

      {/* Live Ride Status Alert from Socket */}
      <AnimatePresence>
        {rideStatus && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] bg-ink text-white px-5 py-2.5 rounded-full shadow-overlay flex items-center gap-2.5 font-semibold text-xs border border-white/10"
            role="status"
            aria-live="polite"
          >
            <Navigation size={15} className="text-primary animate-pulse shrink-0" />
            <span>
              {rideStatus.status === 'confirmed' && 'Driver accepted — heading your way'}
              {rideStatus.status === 'in_progress' && 'Ride in progress — safe travels'}
              {rideStatus.status === 'completed' && 'Ride completed'}
              {rideStatus.status === 'rejected' && 'Booking could not be confirmed'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapPanel;