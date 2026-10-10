import React, { useState } from 'react';
import { Compass, Users, CheckCircle2, ShieldCheck, Car, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PASSENGER_STEPS = [
  {
    step: '01',
    title: 'Search Your Route',
    desc: 'Enter your pickup point, destination, and preferred departure time to find drivers already traveling along your corridor.',
    icon: Compass,
    tag: 'Quick Match',
  },
  {
    step: '02',
    title: 'Choose Verified Ride',
    desc: 'Inspect driver ratings, vehicle model, transparent seat fares, and passenger reviews before booking your seat.',
    icon: ShieldCheck,
    tag: 'Safe Booking',
  },
  {
    step: '03',
    title: 'Travel & Share Costs',
    desc: 'Meet at your pickup point, follow the route with live telemetry, and split travel expenses directly without hidden fees.',
    icon: CheckCircle2,
    tag: 'Save Money',
  },
];

const DRIVER_STEPS = [
  {
    step: '01',
    title: 'Post Your Commute',
    desc: 'Set your regular travel route, departure schedule, and number of open seats in your vehicle.',
    icon: Car,
    tag: 'Fast Listing',
  },
  {
    step: '02',
    title: 'Accept Requests',
    desc: 'Review incoming passenger bookings or accept instant on-demand broadcasts nearby on your console.',
    icon: Users,
    tag: 'Full Control',
  },
  {
    step: '03',
    title: 'Offset Fuel Costs',
    desc: 'Collect settled earnings directly to your wallet on every trip and offset your daily vehicle maintenance costs.',
    icon: Wallet,
    tag: 'Direct Revenue',
  },
];

export const HowItWorksSection = () => {
  const [role, setRole] = useState('passenger'); // 'passenger' | 'driver'

  const currentSteps = role === 'passenger' ? PASSENGER_STEPS : DRIVER_STEPS;

  return (
    <section className="w-full py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-surface border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header & Role Switcher */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">
            Simple Mobility Workflows
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-text-primary font-heading">
            How CarPool Works
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Whether you want to catch a ride to work or monetize empty seats on your daily commute, the process takes less than two minutes.
          </p>

          {/* Role Pill Switcher */}
          <div className="inline-flex items-center rounded-full p-1 bg-border-subtle border border-border">
            <button
              type="button"
              onClick={() => setRole('passenger')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                role === 'passenger'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              For Passengers
            </button>
            <button
              type="button"
              onClick={() => setRole('driver')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                role === 'driver'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              For Drivers
            </button>
          </div>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentSteps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-border bg-background p-6 space-y-4 hover:border-primary/40 hover:shadow-card transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary border border-primary/20 flex items-center justify-center">
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-subtle px-2.5 py-1 rounded-full">
                    {item.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-mono font-bold text-text-muted">
                    STEP {item.step}
                  </span>
                  <h3 className="text-lg font-bold text-text-primary">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Link */}
        <div className="text-center pt-2">
          {role === 'passenger' ? (
            <a
              href="#results-section"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              <span>Explore Available Rides</span>
              <ArrowRight size={13} />
            </a>
          ) : (
            <Link
              to="/driver/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
            >
              <span>Open Driver Partner Portal</span>
              <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
