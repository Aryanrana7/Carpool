import React from 'react';
import { ShieldCheck, IndianRupee, Navigation, Leaf } from 'lucide-react';

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: 'Verified Commuter Profiles',
    desc: 'Every driver and passenger profile includes verified contact credentials, real passenger reviews, and confirmed vehicle details.',
  },
  {
    icon: IndianRupee,
    title: 'Fair, Zero-Surge Cost Sharing',
    desc: 'Seat fares are calculated purely on distance and travel time. No aggressive surge pricing or unexpected last-minute fare hikes.',
  },
  {
    icon: Navigation,
    title: 'Live Route Telemetry & Chat',
    desc: 'Coordinate easily with in-app chat and follow assigned drivers with real-time GPS telemetry and status updates.',
  },
  {
    icon: Leaf,
    title: 'Greener Everyday Commutes',
    desc: 'Sharing rides cuts down single-occupancy car trips, reducing carbon emissions and alleviating peak-hour traffic jams.',
  },
];

export const WhyChooseSection = () => {
  return (
    <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Why Commuters Trust CarPool
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary font-heading">
            Engineered for Everyday Reliability
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            A mobility platform built around transparency, community trust, and dependable daily commutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-surface p-6 space-y-3.5 hover:border-primary/40 hover:shadow-card transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {item.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
