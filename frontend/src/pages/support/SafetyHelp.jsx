import React from 'react';
import { Link } from 'react-router-dom';
import { SupportNav } from '../../components/support/SupportNav';
import { CONTACT_CONFIG } from '../../config/contactConfig';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Share2,
  AlertTriangle,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

export const SafetyHelp = () => {
  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-background flex flex-col transition-colors">
      <SupportNav />

      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Urgent Emergency Alert Banner */}
        <section
          aria-labelledby="emergency-alert-title"
          className="bg-red-600 text-white rounded-2xl p-6 sm:p-8 shadow-card space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert size={28} />
            </div>
            <div className="space-y-1.5">
              <h1 id="emergency-alert-title" className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                In Immediate Danger? Call Emergency Services (112)
              </h1>
              <p className="text-xs sm:text-sm text-red-100 leading-relaxed max-w-2xl">
                If you, a co-passenger, or a driver face physical threat, a medical emergency, or an immediate accident, contact official municipal emergency services immediately.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-red-700 font-extrabold text-sm shadow-sm hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <PhoneCall size={16} />
              <span>Dial 112 (National Emergency Helpline)</span>
            </a>
            <span className="text-xs text-red-200">
              Free 24/7 call accessible from any mobile network in India.
            </span>
          </div>
        </section>

        {/* Clear Distinction Note */}
        <div className="p-4 bg-surface dark:bg-[#18241F] border border-border rounded-xl flex items-start gap-3 text-xs text-text-secondary leading-relaxed">
          <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" />
          <p>
            <strong className="text-text-primary">Important Clarification:</strong> CarPool is a shared mobility platform and does not replace official emergency law enforcement, fire, or ambulance dispatch. The CarPool support channels below provide 24/7 assistance for platform operations, booking mediation, and trip safety incident logging.
          </p>
        </div>

        {/* Actionable Safety Guidance Steps */}
        <section aria-labelledby="guidance-title" className="space-y-6">
          <div className="space-y-1">
            <h2 id="guidance-title" className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
              Step-by-Step Trip Safety Guidance
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Recommended actions to protect your safety during any commute.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Move to Safe Location */}
            <div className="p-6 bg-surface dark:bg-[#18241F] border border-border rounded-2xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center font-bold font-heading">
                1
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Move to a Safe Public Spot
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                If you feel uneasy before boarding or during a stop, do not hesitate to step out at a well-lit, populated location such as a fuel station, metro station, or public junction.
              </p>
            </div>

            {/* Step 2: Share Trip Details */}
            <div className="p-6 bg-surface dark:bg-[#18241F] border border-border rounded-2xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center font-bold font-heading">
                2
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Share Trip Details
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Send your vehicle license plate, driver name, route destination, and expected arrival time to a trusted family member or colleague before departure.
              </p>
            </div>

            {/* Step 3: Log Report with CarPool */}
            <div className="p-6 bg-surface dark:bg-[#18241F] border border-border rounded-2xl space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center font-bold font-heading">
                3
              </div>
              <h3 className="text-base font-bold text-text-primary">
                Report Concerning Behavior
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Report reckless driving, vehicle mismatch, route deviations, or abusive conduct immediately. CarPool logs reports and can suspend violating accounts.
              </p>
            </div>
          </div>
        </section>

        {/* Direct CarPool Contact Channels */}
        <section
          aria-labelledby="carpool-safety-contact-title"
          className="bg-surface dark:bg-[#18241F] border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div className="space-y-1">
            <h2 id="carpool-safety-contact-title" className="text-xl font-bold font-heading text-text-primary">
              CarPool 24/7 Operations & Safety Contacts
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary">
              Reach our operations desk directly for trip mediation, vehicle issues, or urgent platform questions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href={CONTACT_CONFIG.phone.link}
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-border-subtle/50 transition-all text-xs font-semibold text-text-primary group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
                <Phone size={16} />
              </div>
              <div>
                <span className="block text-[11px] text-text-muted">Direct Phone (24/7)</span>
                <span className="font-bold text-primary group-hover:underline">{CONTACT_CONFIG.phone.display}</span>
              </div>
            </a>

            <a
              href={CONTACT_CONFIG.whatsapp.getLink('Hello CarPool Support, I have an urgent safety inquiry regarding a trip.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-border-subtle/50 transition-all text-xs font-semibold text-text-primary group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E8F8F0] text-[#087F5B] dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
                <MessageCircle size={16} />
              </div>
              <div>
                <span className="block text-[11px] text-text-muted">WhatsApp Dispatch (24/7)</span>
                <span className="font-bold text-primary group-hover:underline">Chat on WhatsApp</span>
              </div>
            </a>

            <a
              href={CONTACT_CONFIG.email.getMailtoWithSubject('URGENT: Trip Safety Concern')}
              className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-border-subtle/50 transition-all text-xs font-semibold text-text-primary group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center shrink-0">
                <Mail size={16} />
              </div>
              <div>
                <span className="block text-[11px] text-text-muted">Safety Email</span>
                <span className="font-bold text-primary group-hover:underline truncate max-w-[150px] inline-block">{CONTACT_CONFIG.email.address}</span>
              </div>
            </a>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              to="/report-problem"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-colors"
            >
              <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400" />
              <span>File Formal Incident Report</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SafetyHelp;
