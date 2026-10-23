import React from 'react';
import { Phone, Mail, MessageCircle, Clock, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../ui/InstagramIcon';
import { CONTACT_CONFIG } from '../../config/contactConfig';

export const ContactChannelsGrid = ({ compact = false }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-4`}>
      {/* 1. Phone Support */}
      <a
        href={CONTACT_CONFIG.phone.link}
        className="group flex flex-col justify-between p-5 bg-surface border border-border rounded-xl shadow-xs hover:border-primary hover:shadow-subtle transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Call CarPool Support at ${CONTACT_CONFIG.phone.display}`}
      >
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center transition-transform group-hover:scale-105">
            <Phone size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Phone Support</h3>
            <p className="text-xs text-text-secondary mt-0.5">Direct phone assistance</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
          <span className="text-sm font-extrabold text-primary font-heading tracking-tight">
            {CONTACT_CONFIG.phone.display}
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted">
            <Clock size={11} className="text-primary" />
            <span>24/7</span>
          </div>
        </div>
      </a>

      {/* 2. WhatsApp Support */}
      <a
        href={CONTACT_CONFIG.whatsapp.getLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col justify-between p-5 bg-surface border border-border rounded-xl shadow-xs hover:border-primary hover:shadow-subtle transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Chat with CarPool Support on WhatsApp"
      >
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-success-subtle text-success flex items-center justify-center transition-transform group-hover:scale-105">
            <MessageCircle size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">WhatsApp Support</h3>
            <p className="text-xs text-text-secondary mt-0.5">Fast mobile chat assistance</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
            Chat on WhatsApp
            <ExternalLink size={11} className="opacity-70" />
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted">
            <Clock size={11} className="text-primary" />
            <span>24/7</span>
          </div>
        </div>
      </a>

      {/* 3. Email Support */}
      <a
        href={CONTACT_CONFIG.email.link}
        className="group flex flex-col justify-between p-5 bg-surface border border-border rounded-xl shadow-xs hover:border-primary hover:shadow-subtle transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`Send an email to CarPool Support at ${CONTACT_CONFIG.email.address}`}
      >
        <div className="space-y-3">
          <div className="w-10 h-10 rounded-lg bg-primary-subtle text-primary dark:bg-primary/20 flex items-center justify-center transition-transform group-hover:scale-105">
            <Mail size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">Email Support</h3>
            <p className="text-xs text-text-secondary mt-0.5">Written inquiries & records</p>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
          <span className="text-xs font-bold text-primary truncate max-w-[170px]" title={CONTACT_CONFIG.email.address}>
            {CONTACT_CONFIG.email.address}
          </span>
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-muted">
            <Clock size={11} className="text-primary" />
            <span>24/7</span>
          </div>
        </div>
      </a>

      {/* 4. Social Media: Instagram (Coming Soon) */}
      {!compact && (
        <div
          className="flex flex-col justify-between p-5 bg-surface/60 border border-border/80 rounded-xl shadow-xs"
          aria-label="Instagram page status"
        >
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-border-subtle text-text-muted flex items-center justify-center">
              <InstagramIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-primary">Instagram</h3>
              <p className="text-xs text-text-secondary mt-0.5">Community updates & stories</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted bg-border-subtle px-2 py-0.5 rounded">
              {CONTACT_CONFIG.social.instagram.status}
            </span>
            <span className="text-[11px] text-text-muted">Official channel</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactChannelsGrid;
