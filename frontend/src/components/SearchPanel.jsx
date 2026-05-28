import React, { useState } from 'react';
import LocationInput from './LocationInput';
import PricingPanel from './PricingPanel';
import { MapPin, Navigation, LocateFixed } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchPanel = ({ onSourceChange, onDestinationChange, onSearch, source, destination, onRideTypeSelect, selectedRideType }) => {

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    toast.loading('Detecting location…', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const place = { address: data.display_name, lat: latitude, lng: longitude };
          onSourceChange(place);
          toast.success('Location detected!', { id: 'geo' });
        } catch { toast.error('Failed to get address', { id: 'geo' }); }
      },
      () => toast.error('Location access denied', { id: 'geo' })
    );
  };

  const onSubmit = (e) => { e.preventDefault(); onSearch(); };

  return (
    <div className="w-[280px] flex-shrink-0 h-full flex flex-col bg-white dark:bg-[#111] border-r border-gray-100 dark:border-[#1e1e1e] z-30 overflow-y-auto scrollbar-none">
      
      {/* Top section */}
      <div className="p-5 border-b border-gray-50 dark:border-[#1a1a1a]">
        <h2 className="text-[15px] font-black text-gray-900 dark:text-white mb-4">Book a Ride</h2>

        <form onSubmit={onSubmit} className="space-y-2.5">
          {/* Pickup */}
          <div className="relative">
            <LocationInput
              placeholder="Pickup location"
              onPlaceSelected={onSourceChange}
              icon={MapPin}
              iconColor="text-indigo-500"
            />
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              title="Use current location"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
            >
              <LocateFixed size={14} />
            </button>
          </div>

          {/* Visual connector */}
          <div className="flex items-center gap-2 px-3">
            <div className="w-px h-4 bg-gray-200 dark:bg-[#2a2a2a] ml-1.5" />
          </div>

          {/* Destination */}
          <LocationInput
            placeholder="Where to?"
            onPlaceSelected={onDestinationChange}
            icon={Navigation}
            iconColor="text-violet-500"
          />

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-sm mt-1"
          >
            Search Rides
          </button>
        </form>
      </div>

      {/* Pricing panel — shown when route is set */}
      {source && destination && (
        <div className="p-5 flex-1 overflow-y-auto scrollbar-none">
          <PricingPanel
            source={source}
            destination={destination}
            selectedRideType={selectedRideType}
            onRideTypeSelect={onRideTypeSelect}
          />
        </div>
      )}

      {/* Quick destinations — shown when no route */}
      {(!source || !destination) && (
        <div className="p-5 flex-1">
          <p className="section-label mb-3">Recent</p>
          <div className="space-y-2">
            {[
              { name: 'Airport Terminal 2', sub: 'International Airport' },
              { name: 'Central Station', sub: 'City Centre' },
              { name: 'Tech Park SEZ', sub: 'North District' },
            ].map(({ name, sub }) => (
              <div key={name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
                <div className="w-8 h-8 bg-gray-100 dark:bg-[#222] rounded-xl flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
