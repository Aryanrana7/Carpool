/**
 * Shared Formatting Utilities for CarPool
 * Handles local-timezone date arithmetic, Indian Rupee currency formatting,
 * and distance/duration representations without UTC drift bugs.
 */

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/**
 * Format a number as Indian Rupee (₹)
 * @param {number|string} amount
 * @returns {string} e.g. "₹250"
 */
export const formatCurrency = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (isNaN(num)) return '₹0';
  return currencyFormatter.format(Math.round(num));
};

/**
 * Returns YYYY-MM-DD string for a given date in the user's LOCAL timezone.
 * Resolves the bug where toISOString() converts early-morning IST to the previous day in UTC.
 * @param {Date} [d=new Date()]
 * @returns {string} e.g. "2026-10-11"
 */
export const getLocalISODate = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a date string in the user's LOCAL timezone with relative friendly labels
 * @param {string|Date} dateInput - ISO string, Date object, or "YYYY-MM-DD"
 * @param {Object} [options]
 * @param {boolean} [options.relative=true] - Return "Today", "Tomorrow" when applicable
 * @returns {string} e.g. "Today, 11 Oct" or "Tue, 14 Oct"
 */
export const formatDate = (dateInput, { relative = true } = {}) => {
  if (!dateInput) return '—';

  let dateObj;
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    const [y, m, d] = dateInput.split('-').map(Number);
    dateObj = new Date(y, m - 1, d);
  } else {
    dateObj = new Date(dateInput);
  }

  if (isNaN(dateObj.getTime())) return String(dateInput);

  if (relative) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(dateObj);
    target.setHours(0, 0, 0, 0);

    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const dayMonth = dateObj.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    if (diffDays === 0) return `Today, ${dayMonth}`;
    if (diffDays === 1) return `Tomorrow, ${dayMonth}`;
    if (diffDays === -1) return `Yesterday, ${dayMonth}`;
  }

  return dateObj.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Format a time string or Date into friendly local 12-hour format
 * @param {string|Date} timeInput - e.g. "14:30" or ISO Date string
 * @returns {string} e.g. "2:30 PM"
 */
export const formatTime = (timeInput) => {
  if (!timeInput) return '—';

  if (typeof timeInput === 'string' && /^\d{2}:\d{2}/.test(timeInput)) {
    const [hours, minutes] = timeInput.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 || 12;
    return `${h12}:${String(minutes).padStart(2, '0')} ${period}`;
  }

  const dateObj = new Date(timeInput);
  if (isNaN(dateObj.getTime())) return String(timeInput);

  return dateObj.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format distance value in kilometers
 * @param {number|string} dist - in km or meters if raw number > 500
 * @returns {string} e.g. "4.2 km"
 */
export const formatDistance = (dist) => {
  if (dist === null || dist === undefined || dist === '') return '—';
  let num = typeof dist === 'number' ? dist : parseFloat(dist);
  if (isNaN(num)) return String(dist);

  // If passed as large meter integer
  if (num > 500 && !String(dist).includes('.')) {
    num = num / 1000;
  }

  return `${num.toFixed(1)} km`;
};

/**
 * Format duration value into readable hours & minutes
 * @param {number|string} duration - in minutes or string like "25 mins"
 * @returns {string} e.g. "45 min" or "1 hr 15 min"
 */
export const formatDuration = (duration) => {
  if (!duration && duration !== 0) return '—';

  let mins = typeof duration === 'number' ? duration : parseInt(duration, 10);
  if (isNaN(mins)) return String(duration);

  // If passed as seconds (> 300)
  if (mins > 300 && typeof duration === 'number') {
    mins = Math.round(mins / 60);
  }

  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hrs} hr ${remainingMins} min` : `${hrs} hr`;
};
