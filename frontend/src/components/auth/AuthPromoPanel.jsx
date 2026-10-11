import { useState } from 'react';
import { Car, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getRotatingVariant } from '../../data/authPromoData';

/**
 * Shared Promotional Panel for CarPool Authentication
 * Features:
 * - Controlled refresh-based selection among 6 curated role-specific variants
 * - Bespoke, high-fidelity responsive SVG illustrations matching the variant theme
 * - Verbatim headlines, descriptions, and 3 bullet benefit points
 * - Exact approved CarPool design tokens: Forest dark ink (#18241F), emerald (#087F5B / #12B886), cream accents
 */
export const AuthPromoPanel = ({ role = 'passenger', customSecurityNote, className = '' }) => {
  // Stably initialize each role's variant once per session; stable across re-renders
  const [passengerVariant] = useState(() => getRotatingVariant('passenger'));
  const [driverVariant] = useState(() => getRotatingVariant('driver'));

  const isDriver = role === 'driver';
  const variant = isDriver ? driverVariant : passengerVariant;

  const defaultSecurityNote = isDriver
    ? 'CarPool Driver Operations · Partner Authentication'
    : 'Secure JWT authentication with role-separated portals.';

  const securityNote = customSecurityNote || defaultSecurityNote;
  const IllustrationComponent = variant.Illustration;

  return (
    <div
      className={`w-full lg:w-[45%] bg-[#18241F] text-white p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden select-none border-[#25382F] ${className}`}
      data-testid={`auth-promo-panel-${role}`}
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

      <div className="relative z-10">
        {/* Brand/Role icon pill & Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white shadow-sm shrink-0">
            {isDriver ? <Car size={20} /> : <Car size={20} />}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            {variant.eyebrow}
          </span>
        </div>

        {/* Dynamic Headline */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight mb-3">
          {variant.headline}
        </h1>

        {/* Dynamic Description */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mb-6">
          {variant.description}
        </p>

        {/* Dedicated Themed Illustration (Reserved dimensions prevent layout shift) */}
        <div className="w-full my-4 rounded-xl bg-[#14201B]/80 border border-[#25382F] p-3 shadow-inner overflow-hidden flex items-center justify-center">
          {IllustrationComponent && <IllustrationComponent />}
        </div>

        {/* Benefit Points (3 bullets) */}
        <div className="space-y-3 mt-6 mb-8">
          {variant.benefits.map((point, index) => (
            <div key={index} className="flex items-start gap-3 text-xs sm:text-[13px] text-slate-200">
              <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
              <span className="leading-snug">{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Security Note / Console Badge Footer */}
      <div className="relative z-10 pt-6 border-t border-[#25382F] text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
          {securityNote}
        </span>
        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
          {role === 'driver' ? 'Driver Partner' : 'Passenger Portal'}
        </span>
      </div>
    </div>
  );
};

export default AuthPromoPanel;
