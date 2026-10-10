import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';

export const DriverCtaBanner = () => {
  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-surface border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto rounded-3xl bg-[#18241F] text-white p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-2xl border border-[#25382F]">
        {/* Abstract Background SVG Grid */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <Car size={320} strokeWidth={1} />
        </div>

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider">
            <Car size={13} className="text-emerald-400" />
            <span>Driver Partner Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight font-heading">
            Driving to work alone? Monetize your empty car seats.
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg">
            Publish your daily commute in two minutes. Set your own seat fares, accept passenger bookings or nearby on-demand pickups, and offset your monthly fuel expenses.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <Link
              to="/driver/create-ride"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>Publish a Scheduled Ride</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              to="/driver/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <span>Open Driver Operations Console</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DriverCtaBanner;
