/**
 * Centralized CarPool Official Contact & Support Configuration
 * Source of truth for official communications across the application.
 */

export const CONTACT_CONFIG = {
  phone: {
    display: '+91 9103882218',
    raw: '+919103882218',
    link: 'tel:+919103882218',
  },
  email: {
    address: 'aryan26@expandr.in',
    link: 'mailto:aryan26@expandr.in',
    getMailtoWithSubject: (subject = 'CarPool Support Request') =>
      `mailto:aryan26@expandr.in?subject=${encodeURIComponent(subject)}`,
  },
  whatsapp: {
    display: '+91 9103882218',
    number: '9103882218',
    defaultMessage: 'Hello CarPool Support, I need help with a booking or ride.',
    getLink: (message = 'Hello CarPool Support, I need help with a booking or ride.') =>
      `https://wa.me/919103882218?text=${encodeURIComponent(message)}`,
  },
  availability: {
    label: '24/7 Support Available',
    hours: '24/7, 365 Days',
    note: 'Our automated dispatch and support team monitor requests around the clock.',
  },
  social: {
    instagram: {
      platform: 'Instagram',
      url: null, // No verified Instagram URL exists in repo yet
      status: 'Coming soon',
    },
  },
  emergency: {
    nationalNumber: '112',
    policeNumber: '100',
    ambulanceNumber: '108',
    note: 'In any immediate danger, contact local emergency services immediately.',
  },
};

export default CONTACT_CONFIG;
