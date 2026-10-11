import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { CarPoolLogo } from './ui/CarPoolLogo';
import { InstagramIcon } from './ui/InstagramIcon';
import { CONTACT_CONFIG } from '../config/contactConfig';

export const FooterSection = () => {
  return (
    <footer className="w-full bg-[#18241F] text-slate-300 text-xs border-t border-[#25382F] transition-colors select-none">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* 1. Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" aria-label="CarPool home" className="flex items-center gap-[10px] group w-fit">
              <CarPoolLogo className="h-7 w-auto shrink-0" />
              <span className="text-lg font-heading font-bold tracking-tight text-white">
                CarPool
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              CarPool is a community-first mobility platform connecting daily commuters with verified drivers along shared everyday corridors.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <Clock size={12} className="text-primary animate-pulse" />
              <span>{CONTACT_CONFIG.availability.label}</span>
            </div>
          </div>

          {/* 2. Platform Navigation */}
          <div className="md:col-span-2 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              CarPool
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Find a Ride
                </Link>
              </li>
              <li>
                <Link to="/driver/dashboard" className="text-slate-400 hover:text-white transition-colors">
                  Offer a Ride
                </Link>
              </li>
              <li>
                <Link to="/my-rides" className="text-slate-400 hover:text-white transition-colors">
                  My Trips
                </Link>
              </li>
              <li>
                <Link to="/driver/login" className="text-slate-400 hover:text-white transition-colors">
                  Driver Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Help & Support */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Help & Support
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-slate-400 hover:text-white transition-colors">
                  Help / FAQ
                </Link>
              </li>
              <li>
                <Link to="/report-problem" className="text-slate-400 hover:text-white transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-slate-400 hover:text-white transition-colors">
                  Safety Help
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-slate-400 hover:text-white transition-colors">
                  Share Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Official Direct Contacts */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Official Contact
            </p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={CONTACT_CONFIG.phone.link}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <Phone size={13} className="text-primary shrink-0" />
                  <span>Phone: <strong className="text-slate-200 group-hover:text-white">{CONTACT_CONFIG.phone.display}</strong></span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_CONFIG.email.link}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <Mail size={13} className="text-primary shrink-0" />
                  <span className="truncate max-w-[200px]" title={CONTACT_CONFIG.email.address}>
                    Email: <strong className="text-slate-200 group-hover:text-white">{CONTACT_CONFIG.email.address}</strong>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_CONFIG.whatsapp.getLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                  <MessageCircle size={13} className="text-emerald-400 shrink-0" />
                  <span>WhatsApp: <strong className="text-emerald-300 group-hover:underline">Chat on WhatsApp</strong></span>
                </a>
              </li>
              <li className="pt-1 flex items-center gap-2 text-slate-400">
                <InstagramIcon size={13} className="text-slate-500 shrink-0" />
                <span>Instagram: <span className="text-[10px] font-semibold bg-white/10 text-slate-300 px-1.5 py-0.5 rounded">{CONTACT_CONFIG.social.instagram.status}</span></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#25382F] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} CarPool Mobility Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">•</span>
            <span>24/7 Operations Support</span>
            <span className="text-slate-500">•</span>
            <Link to="/safety" className="hover:text-slate-300 transition-colors">
              Safety First
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
