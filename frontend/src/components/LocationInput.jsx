import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationInput = ({ label, placeholder, icon: Icon, iconColor, onPlaceSelected, initialValue }) => {
  const [query, setQuery] = useState(initialValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (initialValue) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setShowSuggestions(false);
    onPlaceSelected({
      address: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon)
    });
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      {label && (
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <motion.div
        animate={{ scale: isFocused ? 1.02 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 24 }}
        className="relative rounded-xl"
      >
        {Icon && (
          <motion.div
            animate={{ scale: isFocused ? 1.15 : 1 }}
            className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10"
          >
            <Icon className={`h-4 w-4 transition-colors ${isFocused ? 'text-indigo-400' : iconColor || 'text-white/40'}`} />
          </motion.div>
        )}
        <motion.input
          type="text"
          whileFocus={{ boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}
          className={`input-base transition-all duration-200 ${Icon ? 'pl-10' : ''}`}
          style={{
            background: isFocused ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
            borderColor: isFocused ? '#6366f1' : 'rgba(255,255,255,0.08)',
            color: '#fff'
          }}
          placeholder={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (query.length > 2) setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
        />
      </motion.div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 rounded-2xl shadow-2xl max-h-56 overflow-y-auto scrollbar-none border border-white/10"
            style={{ background: 'rgba(18,18,18,0.95)', backdropFilter: 'blur(20px)' }}
          >
            {suggestions.map((place, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                className="px-4 py-3 text-white/80 hover:text-white cursor-pointer text-xs font-medium border-b last:border-0 border-white/5 transition-colors leading-relaxed truncate"
                onClick={() => handleSelect(place)}
              >
                {place.display_name}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationInput;
