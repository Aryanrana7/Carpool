import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { supportService } from '../../services/supportService';
import { SupportNav } from '../../components/support/SupportNav';
import { ContactChannelsGrid } from '../../components/support/ContactChannelsGrid';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ContactUs = () => {
  const { user } = useContext(AuthContext);
  const { driver } = useContext(DriverAuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'passenger',
    category: 'general_inquiry',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill authenticated user details when available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
        role: 'passenger',
      }));
    } else if (driver) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || driver.name || '',
        email: prev.email || driver.email || '',
        phone: prev.phone || driver.phone || '',
        role: 'driver',
      }));
    }
  }, [user, driver]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMsg('Please enter a subject for your message.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please enter your message or question.');
      return;
    }

    setLoading(true);
    try {
      const response = await supportService.submitContact(formData);
      setSuccessResult(response);
      toast.success('Your message has been sent to CarPool Support!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit your message. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setFormData((prev) => ({
      ...prev,
      subject: '',
      message: '',
    }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-background flex flex-col transition-colors">
      <SupportNav />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-subtle text-primary dark:bg-primary/20 dark:text-emerald-300 text-xs font-bold border border-primary/20">
            <Clock size={12} className="text-primary animate-pulse" />
            <span>24/7 Dedicated Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight">
            Contact CarPool Support
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Have questions about a scheduled carpool, on-demand dispatch, account setup, or commute corridors?
            Reach out through our direct communication channels or send us a message below.
          </p>
        </div>

        {/* 1. Direct Contact Channels Grid */}
        <section aria-labelledby="direct-channels-title" className="space-y-4">
          <h2 id="direct-channels-title" className="text-xs font-bold text-text-muted uppercase tracking-wider">
            Direct Support Channels
          </h2>
          <ContactChannelsGrid />
        </section>

        {/* 2. In-App Contact Form */}
        <section
          aria-labelledby="contact-form-title"
          className="bg-surface border border-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs transition-colors"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 id="contact-form-title" className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary mt-1">
                Fill out the details below. If you prefer email or WhatsApp, you can also use the direct buttons above.
              </p>
            </div>

            {successResult ? (
              <div
                role="status"
                aria-live="polite"
                className="p-6 bg-success-subtle/50 dark:bg-emerald-950/30 border border-success/30 rounded-xl space-y-4 text-center sm:text-left"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-text-primary">
                      Message Received Successfully
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {successResult.message}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-surface border border-border rounded-md text-xs font-mono font-bold text-primary">
                      <span>Tracking ID:</span>
                      <span>{successResult.ticketId}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 bg-danger-subtle text-danger border border-red-200 dark:border-red-900/40 rounded-lg flex items-center gap-2.5 text-xs font-semibold"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* User Role Selector */}
                <div>
                  <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, role: 'passenger' }))}
                      className={`
                        py-2.5 px-4 rounded-lg text-xs font-bold border transition-all text-center
                        ${formData.role === 'passenger'
                          ? 'bg-primary-subtle border-primary text-primary shadow-xs'
                          : 'bg-surface dark:bg-black/20 border-border text-text-secondary hover:border-primary/40'
                        }
                      `}
                    >
                      Passenger
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((p) => ({ ...p, role: 'driver' }))}
                      className={`
                        py-2.5 px-4 rounded-lg text-xs font-bold border transition-all text-center
                        ${formData.role === 'driver'
                          ? 'bg-primary-subtle border-primary text-primary shadow-xs'
                          : 'bg-surface dark:bg-black/20 border-border text-text-secondary hover:border-primary/40'
                        }
                      `}
                    >
                      Driver Partner
                    </button>
                  </div>
                </div>

                {/* Name & Email Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Phone & Inquiry Reason */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9103882218"
                  />

                  <div>
                    <label
                      htmlFor="contact-category"
                      className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5"
                    >
                      Topic / Reason
                    </label>
                    <select
                      id="contact-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
                    >
                      <option value="general_inquiry">General Question / Inquiry</option>
                      <option value="booking_cancellation">Booking & Reservations</option>
                      <option value="ride_issue">Ride or Corridor Assistance</option>
                      <option value="account_login">Account or Verification Help</option>
                      <option value="technical">Technical Platform Issue</option>
                      <option value="other">Other Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <Input
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief summary of your question"
                  required
                />

                {/* Message Textarea */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please describe your question or issue in detail..."
                    required
                    className="w-full p-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-y"
                  />
                  <p className="text-[11px] text-text-muted mt-1">
                    Up to 3,000 characters. Our team monitors inquiries 24/7.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <ShieldCheck size={15} className="text-primary shrink-0" />
                    <span>Your contact details are encrypted and securely logged.</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    leftIcon={Send}
                    className="w-full sm:w-auto min-w-[170px]"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
