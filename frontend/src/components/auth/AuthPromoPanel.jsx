import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Users,
  Route,
  CalendarClock,
  Car,
  Navigation,
  ShieldCheck
} from 'lucide-react';
import {
  PASSENGER_VARIANTS,
  DRIVER_VARIANTS,
  getRotatingVariantIndex
} from '../../data/authPromoData';

/**
 * Returns role-consistent, purposeful icons for the 3 benefit points.
 */
const getBenefitIcon = (index, isDriverRole) => {
  if (isDriverRole) {
    switch (index) {
      case 0:
        return <Car size={15} />;
      case 1:
        return <Navigation size={15} />;
      case 2:
      default:
        return <ShieldCheck size={15} />;
    }
  } else {
    switch (index) {
      case 0:
        return <Users size={15} />;
      case 1:
        return <Route size={15} />;
      case 2:
      default:
        return <CalendarClock size={15} />;
    }
  }
};

/**
 * Redesigned Authentication Promotional Panel for CarPool.
 *
 * Implements a cohesive, premium 4-tier hierarchy:
 * A. Brand-Themed Eyebrow: Sleek uppercase category pill with pulsing dot
 * B. Strong Headline & Description: Bold, responsive typography with natural wrapping
 * C. Large Hero Visual: Immersive 520x240 mobility scene with live corridor badges & rotation dots
 * D. Integrated Benefits: 3 translucent glassmorphism rows with consistent emerald jewel icons
 * Footer: Security and portal identity indicators
 */
export const AuthPromoPanel = ({ role = 'passenger', customSecurityNote, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();
  const isDriver = role === 'driver';
  const variants = isDriver ? DRIVER_VARIANTS : PASSENGER_VARIANTS;

  // Stably initialize the variant index from session rotation
  const [currentIndex, setCurrentIndex] = useState(() => getRotatingVariantIndex(role));
  const [prevRole, setPrevRole] = useState(role);
  const [isHovered, setIsHovered] = useState(false);

  // Sync index when role prop switches (React recommended pattern without cascading effect renders)
  if (role !== prevRole) {
    setPrevRole(role);
    setCurrentIndex(getRotatingVariantIndex(role));
  }

  // Auto-advance variant every 10 seconds, pausing on hover or if motion is reduced
  useEffect(() => {
    if (shouldReduceMotion || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % variants.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [shouldReduceMotion, isHovered, variants.length]);


  const variant = variants[currentIndex] || variants[0];
  const IllustrationComponent = variant.Illustration;

  const defaultSecurityNote = isDriver
    ? 'CarPool Driver Operations · Partner Authentication'
    : 'Secure JWT authentication with role-separated portals.';

  const securityNote = customSecurityNote || defaultSecurityNote;

  return (
    <div
      className={`w-full h-full bg-[#192A20] text-white p-5 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between relative overflow-hidden select-none ${className}`}
      data-testid={`auth-promo-panel-${role}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle background route grid backdrop */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
        <svg width="600" height="600" viewBox="0 0 600 600" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="150" cy="150" r="8" fill="currentColor" />
          <circle cx="450" cy="180" r="8" fill="currentColor" />
          <circle cx="300" cy="380" r="8" fill="currentColor" />
          <circle cx="480" cy="480" r="8" fill="currentColor" />
          <path d="M150 150 Q 300 120 450 180" strokeDasharray="4 4" />
          <path d="M150 150 Q 200 300 300 380" />
          <path d="M450 180 Q 400 300 300 380" strokeDasharray="6 6" />
          <path d="M300 380 Q 400 450 480 480" />
        </svg>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${role}-${currentIndex}`}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex-1 flex flex-col justify-between"
        >
          <div className="flex flex-col">
            {/* Section A: Brand-Themed Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-[#D2E2D8] text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 backdrop-blur-md self-start">
              <span className="relative flex h-2 w-2">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7EAA93] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[11px] font-bold text-[#D2E2D8] tracking-widest">
                {isDriver ? 'DRIVER OPERATIONS' : 'SHARED MOBILITY'}
              </span>
              <span className="text-primary/50 text-[10px]">•</span>
              <span className="text-slate-300 text-xs font-medium tracking-normal normal-case">
                {variant.eyebrow}
              </span>
            </div>

            {/* Section B: Strong Headline & Description */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-extrabold tracking-tight text-white leading-[1.18] max-w-lg mb-2 sm:mb-2.5">
              {variant.headline}
            </h1>
            <p className="text-slate-300 text-sm sm:text-[15px] lg:text-[16px] leading-relaxed max-w-md lg:max-w-lg mb-3 sm:mb-4">
              {variant.description}
            </p>

            {/* Section C: Large Hero Visual Scene */}
            <div className="w-full rounded-2xl bg-gradient-to-b from-[#16231C]/95 via-[#121E17]/90 to-[#0E1712]/95 border border-[#24382D] shadow-xl relative overflow-hidden flex flex-col justify-between my-2 sm:my-3 p-3.5 sm:p-5 min-h-[240px] sm:min-h-[270px] lg:min-h-[290px]">
              {/* Contextual Status Badges */}
              <div className="w-full flex items-center justify-between z-10 mb-1">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#192A20]/85 border border-primary/35 text-[11px] font-semibold text-[#D2E2D8] backdrop-blur-md shadow-sm">
                  <span className={`w-1.5 h-1.5 rounded-full ${isDriver ? 'bg-accent' : 'bg-[#7EAA93]'} animate-pulse`} />
                  {isDriver ? 'Active Dispatch Hub' : 'Live Shared Corridor'}
                </div>
                <div className="px-2.5 py-1 rounded-full bg-[#192A20]/85 border border-white/10 text-[10px] font-mono tracking-wider text-slate-300 backdrop-blur-md">
                  {isDriver ? 'DRIVER CONSOLE · READY' : 'CO-COMMUTE · OPTIMIZED'}
                </div>
              </div>

              {/* Vector Artwork Scene */}
              <div className="flex-1 w-full flex items-center justify-center my-1">
                {IllustrationComponent && <IllustrationComponent />}
              </div>

              {/* Concept Indicator & Navigation */}
              <div className="w-full flex items-center justify-between pt-2 border-t border-white/[0.06] z-10">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Concept {currentIndex + 1} of {variants.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {variants.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Switch to concept ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? 'w-5 bg-primary shadow-sm shadow-primary/50'
                          : 'w-1.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Section D: Integrated Benefits (3 Cohesive Rows) */}
            <div className="space-y-2 sm:space-y-2.5 my-2.5 sm:my-3.5">
              {variant.benefits.map((point, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.035] hover:bg-white/[0.06] border border-white/[0.08] hover:border-primary/40 transition-all duration-200 backdrop-blur-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 text-[#D2E2D8]">
                    {getBenefitIcon(index, isDriver)}
                  </div>
                  <span className="text-xs sm:text-[13px] text-slate-200 font-medium leading-snug">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Portal Operations & Security Footer */}
          <div className="pt-4 sm:pt-5 border-t border-[#24382D] text-[11px] text-slate-400 flex items-center justify-between shrink-0">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#D2E2D8] shrink-0" />
              {securityNote}
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-white/[0.04] border border-white/5">
              {isDriver ? 'Driver Partner' : 'Passenger Portal'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AuthPromoPanel;
