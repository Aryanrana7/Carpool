import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Leaf,
  ShieldCheck,
  Search,
  Car,
  Fuel,
  Zap,
  MapPin,
} from 'lucide-react';

/**
 * Authentic Hero Visual matching the user's reference design.
 * Features:
 * - Eyebrow pill: 'SHARED MOBILITY' or 'DRIVER PARTNER MOBILITY'
 * - Headline: 'Same Routes. Richer Journeys.' or 'Fill Empty Seats. Share The Drive.'
 * - Subtitle description
 * - Two Action Buttons: [ 🔍 Find a Ride ] and [ 🚗 Offer a Ride ]
 * - 3 Minimalist Features: Trusted Commuters, Lower Travel Costs, Safer Journeys
 * - Curved Sinuous Journey Route Graphic (Your Location -> Car -> Your Destination)
 * - Bottom Frosted Glass Testimonial with overlapping commuter avatars
 */
export const AuthPromoBanner = ({ role = 'passenger', onRoleSwitch }) => {
  const navigate = useNavigate();
  const isDriver = role === 'driver';

  const handleFindRide = () => {
    if (isDriver) {
      if (onRoleSwitch) onRoleSwitch('passenger');
      else navigate('/login');
    }
  };

  const handleOfferRide = () => {
    if (!isDriver) {
      if (onRoleSwitch) onRoleSwitch('driver');
      else navigate('/driver/login');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-full flex flex-col justify-between p-5 sm:p-7 lg:p-8 xl:p-10 select-none z-10">
      {/* Top Section: Eyebrow + Headline + Subtitle + Action Buttons + 3 Features */}
      <div className="flex flex-col">
        {/* Eyebrow Label with Brand Theme Badge */}
        <div className="mb-2.5 sm:mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle border border-primary/25 text-primary text-[11px] font-bold tracking-widest uppercase shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>{isDriver ? 'Driver Partner Mobility' : 'Shared Mobility'}</span>
          </span>
        </div>

        {/* Big Bold Headline matching reference */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-black text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-2.5 max-w-lg">
          {isDriver ? (
            <>
              Fill Empty Seats.<br />
              Share The Drive.
            </>
          ) : (
            <>
              Same Routes.<br />
              Richer Journeys.
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-[13px] lg:text-sm font-medium leading-relaxed max-w-md mb-5 sm:mb-6">
          {isDriver
            ? 'Turn your regular solo commute into monthly fuel savings. Connect with verified passengers heading your way.'
            : 'Find trusted people, share travel costs, and turn your daily commute into a better experience.'}
        </p>

        {/* Hero Action Buttons: [ 🔍 Find a Ride ] and [ 🚗 Offer a Ride ] */}
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <button
            type="button"
            onClick={handleFindRide}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-[13px] flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${
              !isDriver
                ? 'bg-primary text-white shadow-md hover:bg-primary-hover scale-[1.02]'
                : 'bg-white/95 dark:bg-slate-800/90 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-white hover:shadow'
            }`}
          >
            <Search size={15} className={!isDriver ? 'text-primary-subtle' : 'text-text-secondary'} />
            <span>Find a Ride</span>
          </button>

          <button
            type="button"
            onClick={handleOfferRide}
            className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-[13px] flex items-center gap-2 transition-all duration-200 cursor-pointer shadow-sm ${
              isDriver
                ? 'bg-primary text-white shadow-md hover:bg-primary-hover scale-[1.02]'
                : 'bg-white/95 dark:bg-slate-800/90 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-white hover:shadow'
            }`}
          >
            <Car size={16} className={isDriver ? 'text-primary-subtle' : 'text-text-secondary'} />
            <span>Offer a Ride</span>
          </button>
        </div>

        {/* 3 Minimalist Highlights Row matching reference */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mb-4 sm:mb-6">
          {!isDriver ? (
            <>
              {/* Feature 1 */}
              <div className="flex flex-col gap-1.5">
                <Users size={20} className="text-slate-800 dark:text-slate-100" />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    Trusted
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Commuters
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-1.5">
                <Leaf size={20} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    Lower
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Travel Costs
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-1.5">
                <ShieldCheck size={20} className="text-primary" />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    Safer
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Journeys
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Driver Feature 1 */}
              <div className="flex flex-col gap-1.5">
                <Fuel size={20} className="text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    Cover
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Fuel Costs
                  </p>
                </div>
              </div>

              {/* Driver Feature 2 */}
              <div className="flex flex-col gap-1.5">
                <ShieldCheck size={20} className="text-primary" />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    Verified
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Passengers
                  </p>
                </div>
              </div>

              {/* Driver Feature 3 */}
              <div className="flex flex-col gap-1.5">
                <Zap size={20} className="text-amber-500" />
                <div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    Zero
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Detours
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle/Bottom: Curved Interactive Journey Route Graphic */}
      <div className="my-3 sm:my-5 relative max-w-xl w-full">
        <div className="relative w-full h-16 sm:h-20 flex items-center justify-between">
          {/* Origin Card Pill */}
          <div className="z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-md border border-white/80 dark:border-white/10 backdrop-blur-md">
            <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin size={12} className="fill-white" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
              {isDriver ? 'Pickup Point' : 'Your Location'}
            </span>
          </div>

          {/* Sinuous SVG Curve Connecting Origin to Destination */}
          <div className="absolute inset-0 flex items-center pointer-events-none px-4">
            <svg
              viewBox="0 0 500 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#315B45" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#315B45" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              {/* Outer soft glow line */}
              <path
                d="M 80,35 C 140,8 190,62 250,35 C 310,8 360,62 420,35"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Inner glowing route path */}
              <path
                d="M 80,35 C 140,8 190,62 250,35 C 310,8 360,62 420,35"
                stroke="url(#routeGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Midpoint Car Badge */}
          <div className="z-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-primary/30 animate-ping" />
              <div className="relative w-8 h-8 rounded-full bg-primary border-2 border-white text-white flex items-center justify-center shadow-lg">
                <Car size={15} />
              </div>
            </div>
          </div>

          {/* Destination Card Pill */}
          <div className="z-10 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-md border border-white/80 dark:border-white/10 backdrop-blur-md">
            <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin size={12} className="fill-white" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap">
              {isDriver ? 'Work Hub' : 'Your Destination'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Frosted Glass Testimonial Card matching reference */}
      <div className="mt-2 sm:mt-3 max-w-lg w-full">
        <div className="backdrop-blur-xl bg-black/25 dark:bg-black/40 border border-white/30 dark:border-white/15 rounded-2xl p-3.5 sm:p-4 text-white shadow-xl flex items-center gap-3.5">
          {/* 3 Overlapping Avatars */}
          <div className="flex -space-x-2.5 shrink-0 select-none">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Commuter"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Commuter"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80"
              alt="Commuter"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* Testimonial Quote & Count */}
          <div className="min-w-0">
            <p className="text-xs sm:text-[13px] font-bold text-white leading-snug">
              {isDriver
                ? '“Covered 85% of my monthly fuel costs with daily commuters.”'
                : '“Same route. New people. Better days.”'}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-200 mt-0.5 leading-tight">
              {isDriver
                ? 'Join 4,200+ verified drivers monetizing their regular journeys with CarPool.'
                : 'Join thousands of commuters already sharing their journeys with CarPool.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPromoBanner;
