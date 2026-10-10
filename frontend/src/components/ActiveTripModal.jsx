import React, { useContext, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Navigation, MessageSquare, Star, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SocketContext } from '../context/SocketContext';
import { ThemeContext } from '../context/ThemeContext';
import { formatCurrency, formatDate, formatTime } from '../utils/formatters';
import Button from './ui/Button';
import Badge from './ui/Badge';
import TrustStrip from './ui/TrustStrip';
import FareLabel from './ui/FareLabel';
import RouteConnector from './ui/RouteConnector';

// Clean SVG Pin and Car DivIcons
const buildPinIcon = (color = '#087F5B', label = 'PICKUP') =>
  L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div style="background:${color};color:#ffffff;font-size:9px;font-weight:700;letter-spacing:0.04em;padding:3px 7px;border-radius:6px;box-shadow:0 4px 12px rgba(24,36,31,0.3);border:1.5px solid #ffffff;white-space:nowrap;">
          ${label}
        </div>
        <div style="width:2px;height:4px;background:${color};"></div>
        <div style="width:5px;height:5px;background:${color};border-radius:50%;box-shadow:0 0 6px ${color};"></div>
      </div>
    `,
    className: 'custom-pin-marker',
    iconSize: [56, 32],
    iconAnchor: [28, 28],
  });

const buildCarIcon = () =>
  L.divIcon({
    html: `
      <div
        style="
          width:36px;
          height:36px;
          background:#087F5B;
          color:#ffffff;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          border:2.5px solid #ffffff;
          box-shadow:0 4px 14px rgba(8,127,91,0.45);
        "
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
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

const MapFitter = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  }, [bounds, map]);
  return null;
};

export const ActiveTripModal = ({ isOpen, booking, onClose, onChatOpen }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const socketContext = useContext(SocketContext);
  const driverLocation = socketContext?.driverLocation;

  const ride = booking?.ride;
  const driver = ride?.driver;

  const pickupCoords =
    ride?.sourceCoords?.lat && ride?.sourceCoords?.lng
      ? [ride.sourceCoords.lat, ride.sourceCoords.lng]
      : [30.7333, 76.7794];

  const dropoffCoords =
    ride?.destinationCoords?.lat && ride?.destinationCoords?.lng
      ? [ride.destinationCoords.lat, ride.destinationCoords.lng]
      : [28.6139, 77.2090];

  const currentDriverPos = driverLocation
    ? [driverLocation.lat, driverLocation.lng]
    : driver?.currentLocation?.lat && driver?.currentLocation?.lng
    ? [driver.currentLocation.lat, driver.currentLocation.lng]
    : pickupCoords;

  const routePositions = [pickupCoords, dropoffCoords];
  const bounds = L.latLngBounds([pickupCoords, dropoffCoords, currentDriverPos]);

  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  if (!isOpen || !booking) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/50 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="active-trip-title"
          className="relative w-full max-w-4xl bg-surface rounded-xl shadow-modal border border-border overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-background shrink-0">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={ArrowLeft}
                onClick={onClose}
              >
                Back
              </Button>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Badge status="in_progress" label="En Route · Active Trip" size="sm" />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close trip tracking"
              className="w-8 h-8 rounded-md border border-border bg-surface hover:bg-background flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body: Map & Trip Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 min-h-0 overflow-y-auto">
            {/* Live Map Panel */}
            <div className="lg:col-span-7 h-[280px] lg:h-auto min-h-[280px] relative z-0">
              <MapContainer
                center={currentDriverPos}
                zoom={12}
                className="w-full h-full"
                zoomControl={true}
              >
                <TileLayer
                  key={isDarkMode ? 'dark' : 'light'}
                  url={tileUrl}
                  attribution={tileAttribution}
                  maxZoom={19}
                  subdomains="abcd"
                />
                <MapFitter bounds={bounds} />

                {/* Pickup marker */}
                <Marker position={pickupCoords} icon={buildPinIcon('#087F5B', 'PICKUP')}>
                  <Popup>
                    <div className="text-center p-1 font-sans">
                      <strong className="text-xs text-primary block">Pickup Location</strong>
                      <span className="text-[11px] text-text-secondary">{ride?.pickupLocation || ride?.source}</span>
                    </div>
                  </Popup>
                </Marker>

                {/* Destination marker */}
                <Marker position={dropoffCoords} icon={buildPinIcon('#18241F', 'DROPOFF')}>
                  <Popup>
                    <div className="text-center p-1 font-sans">
                      <strong className="text-xs text-text-primary block">Dropoff Point</strong>
                      <span className="text-[11px] text-text-secondary">{ride?.dropoffLocation || ride?.destination}</span>
                    </div>
                  </Popup>
                </Marker>

                {/* Route polyline with casing */}
                <Polyline
                  positions={routePositions}
                  color={isDarkMode ? '#0E1713' : '#18241F'}
                  weight={6}
                  opacity={0.85}
                />
                <Polyline
                  positions={routePositions}
                  color="#087F5B"
                  weight={3.5}
                  opacity={0.95}
                />

                {/* Live Driver marker */}
                <Marker position={currentDriverPos} icon={buildCarIcon()}>
                  <Popup>
                    <div className="text-center p-1 font-sans">
                      <strong className="text-xs text-success block">Assigned Driver</strong>
                      <span className="text-[11px] text-text-secondary">{driver?.name || 'Driver'}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Trip Info Details Panel */}
            <div className="lg:col-span-5 p-5 space-y-4 overflow-y-auto bg-surface border-t lg:border-t-0 lg:border-l border-border">
              {/* Driver Card */}
              <div className="bg-background border border-border rounded-lg p-4 space-y-3">
                <p className="micro-label">Driver Details</p>
                <TrustStrip
                  driver={{
                    ...driver,
                    carModel: driver?.carModel || ride?.carType,
                    carNumber: driver?.carNumber,
                  }}
                  size="md"
                  showVehicle={true}
                />

                {onChatOpen && (
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    leftIcon={MessageSquare}
                    onClick={() => onChatOpen(booking)}
                  >
                    Chat with Driver
                  </Button>
                )}
              </div>

              {/* Journey summary */}
              <div className="bg-background border border-border rounded-lg p-4 space-y-3 text-xs">
                <p className="micro-label">Journey Details</p>
                <div className="flex items-stretch gap-2.5">
                  <RouteConnector className="py-1" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="text-[10px] text-text-muted uppercase font-semibold block">Pickup</span>
                      <span className="font-semibold text-text-primary leading-snug">
                        {ride?.pickupLocation || ride?.source}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-text-muted uppercase font-semibold block">Destination</span>
                      <span className="font-semibold text-text-primary leading-snug">
                        {ride?.dropoffLocation || ride?.destination}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-border flex justify-between items-center">
                  <span className="text-text-secondary">Fare Paid</span>
                  <FareLabel amount={ride?.price} size="md" highlight />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActiveTripModal;
