import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import api from '../services/api';

export const LocationInput = ({
  label,
  placeholder,
  icon: Icon = MapPin,
  iconColor,
  onPlaceSelected,
  initialValue,
  id,
  variant = 'default', // 'default' | 'unified'
  className = '',
}) => {
  const [query, setQuery] = useState(initialValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (initialValue !== undefined) {
      setQuery(initialValue || '');
    }
  }, [initialValue]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        try {
          const { data } = await api.get('/proxy/geocode', { params: { q: query.trim() } });
          setSuggestions(data || []);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch {
          // silent error
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setShowSuggestions(false);
    setIsFocused(false);
    if (onPlaceSelected) {
      onPlaceSelected({
        address: place.display_name,
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      });
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const isUnified = variant === 'unified';

  return (
    <div className={`w-full relative ${className}`} ref={wrapperRef}>
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className={`text-text-muted pointer-events-none flex items-center ${isUnified ? 'absolute left-0' : 'absolute left-3'}`}>
            <Icon size={isUnified ? 14 : 16} className={isFocused ? 'text-primary' : iconColor || 'text-text-muted'} />
          </div>
        )}

        <input
          id={id}
          type="text"
          className={
            isUnified
              ? `w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 p-0 text-xs sm:text-sm font-semibold text-text-primary placeholder:text-text-muted/70 truncate ${Icon ? 'pl-5 sm:pl-5.5' : ''} ${query ? 'pr-5' : ''}`
              : `input-base text-sm ${Icon ? 'pl-9' : 'pl-3.5'} pr-8 ${isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`
          }
          placeholder={placeholder}
          value={query}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            const val = e.target.value;
            setQuery(val);
            if (onPlaceSelected) {
              onPlaceSelected({
                address: val,
                lat: null,
                lng: null,
              });
            }
          }}
          onFocus={() => {
            setIsFocused(true);
            if (query.length > 2 && suggestions.length > 0) setShowSuggestions(true);
          }}
        />

        {query && (
          <button
            type="button"
            aria-label="Clear location input"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
              if (onPlaceSelected) {
                onPlaceSelected(null);
              }
            }}
            className="absolute right-2.5 p-1 text-text-muted hover:text-text-primary rounded-full hover:bg-border-subtle transition-colors cursor-pointer"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className={`absolute z-[600] left-0 mt-2 rounded-xl shadow-overlay max-h-56 overflow-y-auto border border-border bg-surface text-text-primary ${
              isUnified ? 'min-w-[280px] sm:min-w-[340px] w-auto max-w-[90vw]' : 'w-full'
            }`}
          >
            {suggestions.map((place, index) => (
              <div
                key={index}
                role="option"
                aria-selected={selectedIndex === index}
                className={`
                  px-3.5 py-2.5 cursor-pointer text-xs font-medium border-b last:border-0 border-border
                  flex items-start gap-2.5 transition-colors leading-relaxed truncate
                  ${selectedIndex === index ? 'bg-primary-subtle text-primary' : 'hover:bg-background text-text-primary'}
                `}
                onClick={() => handleSelect(place)}
              >
                <MapPin size={14} className="shrink-0 mt-0.5 text-text-muted" />
                <span className="truncate">{place.display_name}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationInput;
