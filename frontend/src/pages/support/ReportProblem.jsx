import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { supportService } from '../../services/supportService';
import api from '../../services/api';
import { SupportNav } from '../../components/support/SupportNav';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Shield,
  Clock,
  History,
  Send,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ReportProblem = () => {
  const { user } = useContext(AuthContext);
  const { driver } = useContext(DriverAuthContext);

  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [userBookings, setUserBookings] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'ride_issue',
    subject: '',
    description: '',
    relatedBookingId: '',
  });

  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill user details & fetch recent bookings if signed in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));

      // Fetch bookings for easy selection
      api
        .get('/bookings/my-bookings')
        .then((res) => setUserBookings(res.data || []))
        .catch(() => {});
    } else if (driver) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || driver.name || '',
        email: prev.email || driver.email || '',
        phone: prev.phone || driver.phone || '',
      }));
    }
  }, [user, driver]);

  // Load ticket history if user switches to history tab
  const loadHistory = async () => {
    if (!user && !driver) return;
    setLoadingHistory(true);
    try {
      const res = await supportService.getMyReports();
      setMyTickets(res.tickets || []);
    } catch {
      toast.error('Could not load report history');
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMsg('Please enter a subject for your report.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg('Please provide a detailed description of the issue.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        isEmergency: formData.category === 'safety_concern',
      };
      const res = await supportService.submitReport(payload);
      setSuccessResult(res);
      toast.success('Your report has been logged successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit report. Please try again.';
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
      description: '',
      relatedBookingId: '',
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success-subtle text-success border border-success/30">
            Resolved
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-warning-subtle text-warning border border-warning/30">
            In Progress
          </span>
        );
      case 'closed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-border-subtle text-text-muted border border-border">
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary-subtle text-primary border border-primary/30">
            Open / Under Review
          </span>
        );
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-background flex flex-col transition-colors">
      <SupportNav />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
            <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Problem & Incident Resolution</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight">
            Report a Problem or Incident
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Report booking discrepancies, driver or passenger misconduct, map glitches, or safety concerns. Every report is assigned a tracking reference and reviewed by our operations team.
          </p>

          {(user || driver) && (
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'new'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface text-text-secondary border border-border hover:text-text-primary'
                }`}
              >
                File New Report
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'history'
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface text-text-secondary border border-border hover:text-text-primary'
                }`}
              >
                <History size={13} />
                <span>My Reports History</span>
              </button>
            </div>
          )}
        </div>

        {activeTab === 'history' ? (
          /* Report History View */
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold font-heading text-text-primary">
                  Your Submitted Reports
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Track the status of tickets submitted from your verified account.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={loadHistory} loading={loadingHistory}>
                Refresh
              </Button>
            </div>

            {loadingHistory ? (
              <div className="py-12 text-center text-xs text-text-muted">Loading your tickets...</div>
            ) : myTickets.length > 0 ? (
              <div className="divide-y divide-border-subtle">
                {myTickets.map((ticket) => (
                  <div key={ticket.ticketId} className="py-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary">
                          {ticket.ticketId}
                        </span>
                        {getStatusBadge(ticket.status)}
                      </div>
                      <span className="text-[11px] text-text-muted">
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary">{ticket.subject}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                      {ticket.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-3">
                <FileText size={32} className="mx-auto text-text-muted opacity-50" />
                <p className="text-xs text-text-secondary">You haven't submitted any reports yet.</p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('new')}>
                  Submit a Report
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* New Report Form */
          <section
            aria-labelledby="report-form-title"
            className="bg-surface border border-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs transition-colors"
          >
            {successResult ? (
              <div
                role="status"
                aria-live="polite"
                className="p-6 bg-success-subtle/50 dark:bg-emerald-950/30 border border-success/30 rounded-xl space-y-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-text-primary">
                      Report Submitted & Logged
                    </h2>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {successResult.message}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-surface border border-border rounded-md text-xs font-mono font-bold text-primary">
                      <span>Tracking Reference:</span>
                      <span>{successResult.ticketId}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    File Another Report
                  </Button>
                  {(user || driver) && (
                    <Button variant="primary" size="sm" onClick={() => setActiveTab('history')}>
                      View Report History
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <h2 id="report-form-title" className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                    Report Form
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary mt-1">
                    Provide precise details so our safety and operations teams can investigate quickly.
                  </p>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3.5 bg-danger-subtle text-danger border border-red-200 dark:border-red-900/40 rounded-lg flex items-center gap-2.5 text-xs font-semibold"
                  >
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Category Selector */}
                <div>
                  <label
                    htmlFor="report-category"
                    className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5"
                  >
                    Issue Category *
                  </label>
                  <select
                    id="report-category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option value="ride_issue">Ride, Driver, or Passenger Conduct Issue</option>
                    <option value="safety_concern">Safety Concern or Urgent Incident</option>
                    <option value="booking_cancellation">Booking, Cancellation, or Seat Dispute</option>
                    <option value="tracking_map">GPS Live Tracking or Map Telemetry Glitch</option>
                    <option value="account_login">Account Access, Verification, or Profile Issue</option>
                    <option value="technical">Technical Bug or App Problem</option>
                    <option value="other">Other Issue</option>
                  </select>
                </div>

                {/* Safety Alert Note if safety_concern selected */}
                {formData.category === 'safety_concern' && (
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <Shield size={14} className="text-amber-600 dark:text-amber-400" />
                      Immediate Danger Warning
                    </p>
                    <p className="leading-relaxed">
                      If you or anyone else is facing immediate danger, call official local emergency police services immediately (Dial 112).
                    </p>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />

                  <Input
                    label="Contact Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                </div>

                {/* Phone & Related Booking */}
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
                      htmlFor="related-booking"
                      className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5"
                    >
                      Related Booking / Trip (Optional)
                    </label>
                    {userBookings.length > 0 ? (
                      <select
                        id="related-booking"
                        name="relatedBookingId"
                        value={formData.relatedBookingId}
                        onChange={handleChange}
                        className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                      >
                        <option value="">No specific booking / None</option>
                        {userBookings.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.ride?.source || 'Trip'} → {b.ride?.destination || 'Destination'} (ID: {b._id.slice(-6)})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="related-booking"
                        type="text"
                        name="relatedBookingId"
                        value={formData.relatedBookingId}
                        onChange={handleChange}
                        placeholder="Optional Booking ID (e.g. 64a...)"
                        className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>
                </div>

                {/* Subject */}
                <Input
                  label="Subject Summary"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Driver vehicle did not match registered license plate"
                  required
                />

                {/* Detailed Description */}
                <div>
                  <label
                    htmlFor="report-description"
                    className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5"
                  >
                    Problem Description *
                  </label>
                  <textarea
                    id="report-description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide specific details including approximate time, location, behavior, or error message..."
                    required
                    className="w-full p-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                  />
                  <p className="text-[11px] text-text-muted mt-1">
                    Up to 3,000 characters. Reports are permanently audited for passenger & driver safety.
                  </p>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-xs text-text-muted">
                    24/7 Operations review • Reference ID provided upon receipt
                  </span>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    leftIcon={Send}
                    className="w-full sm:w-auto min-w-[170px]"
                  >
                    Submit Report
                  </Button>
                </div>
              </form>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ReportProblem;
