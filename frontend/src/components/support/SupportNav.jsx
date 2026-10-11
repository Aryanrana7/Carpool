import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, HelpCircle, AlertTriangle, Shield, MessageSquare, Clock } from 'lucide-react';
import { CONTACT_CONFIG } from '../../config/contactConfig';

const NAV_ITEMS = [
  { to: '/contact', label: 'Contact Us', icon: Mail },
  { to: '/help', label: 'Help & FAQ', icon: HelpCircle },
  { to: '/report-problem', label: 'Report a Problem', icon: AlertTriangle },
  { to: '/safety', label: 'Safety Help', icon: Shield },
  { to: '/feedback', label: 'Share Feedback', icon: MessageSquare },
];

export const SupportNav = () => {
  return (
    <div className="w-full bg-surface dark:bg-[#18241F] border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Section Navigation Tabs */}
          <nav
            aria-label="Support Navigation"
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5"
          >
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none
                  ${isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle'
                  }
                `}
              >
                <Icon size={14} className="shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* 24/7 Availability Indicator */}
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary dark:bg-primary/20 dark:text-emerald-300 text-xs font-bold border border-primary/20 shrink-0">
            <Clock size={13} className="text-primary animate-pulse" />
            <span>{CONTACT_CONFIG.availability.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportNav;
