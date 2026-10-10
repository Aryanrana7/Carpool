import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Heart, MapPin, Compass } from 'lucide-react';

export const FooterSection = () => {
  return (
    <footer className="w-full bg-[#18241F] text-slate-300 text-xs border-t border-[#25382F] transition-colors select-none">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Car size={18} />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                CarPool
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              CarPool is a modern community mobility platform connecting daily commuters with verified drivers along everyday corridors. Share journeys, cut costs, and travel smarter.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck size={14} className="text-primary" />
              <span>Verified driver profiles & real-time telemetry</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Navigation
            </p>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Find Scheduled Carpools
                </Link>
              </li>
              <li>
                <Link to="/my-rides" className="hover:text-white transition-colors">
                  My Trips & Active Bookings
                </Link>
              </li>
              <li>
                <Link to="/driver/dashboard" className="hover:text-white transition-colors">
                  Driver Operations Console
                </Link>
              </li>
              <li>
                <Link to="/driver/create-ride" className="hover:text-white transition-colors">
                  Publish a Scheduled Route
                </Link>
              </li>
              <li>
                <Link to="/driver/login" className="hover:text-white transition-colors">
                  Driver Partner Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Corridors */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Popular Corridors
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-primary shrink-0" />
                <span>Chandigarh ↔ New Delhi</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-primary shrink-0" />
                <span>Mohali IT City ↔ Sector 17</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-primary shrink-0" />
                <span>Panchkula ↔ Chandigarh Airport</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin size={12} className="text-primary shrink-0" />
                <span>Zirakpur ↔ Sector 34 Tech Zone</span>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">
              Platform
            </p>
            <ul className="space-y-2 text-slate-400">
              <li>Zero Surge Pricing</li>
              <li>GPS Route Tracking</li>
              <li>In-App Live Chat</li>
              <li>Community Reviews</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#25382F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} CarPool Mobility Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with React, Node.js & OpenStreetMap
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
