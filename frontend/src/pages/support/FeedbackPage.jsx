import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { supportService } from '../../services/supportService';
import { SupportNav } from '../../components/support/SupportNav';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Star,
  Send,
  Heart,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const FeedbackPage = () => {
  const { user } = useContext(AuthContext);
  const { driver } = useContext(DriverAuthContext);

  const [formData, setFormData] = useState({
    category: 'app_experience',
    rating: 5,
    message: '',
    contactPreference: 'none',
    email: '',
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: prev.email || user.email }));
    } else if (driver?.email) {
      setFormData((prev) => ({ ...prev, email: prev.email || driver.email }));
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

    if (!formData.message.trim()) {
      setErrorMsg('Please enter your feedback message.');
      return;
    }

    if (formData.contactPreference === 'email') {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        setErrorMsg('Please enter a valid email address for contact follow-up.');
        return;
      }
    }

    setLoading(true);
    try {
      await supportService.submitFeedback(formData);
      setSuccess(true);
      toast.success('Thank you for your feedback!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit feedback. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setFormData((prev) => ({
      ...prev,
      message: '',
      rating: 5,
    }));
  };

  return (
    <div className="w-full min-h-[calc(100vh-68px)] bg-background flex flex-col transition-colors">
      <SupportNav />

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Intro */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-subtle text-primary dark:bg-primary/20 dark:text-emerald-300 text-xs font-bold border border-primary/20">
            <Sparkles size={13} className="text-primary" />
            <span>Product Suggestions & Feedback</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary tracking-tight">
            Share Your Experience
          </h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Your ideas and honest feedback directly shape our commute features, corridor matching, and app reliability.
          </p>
        </div>

        {/* Feedback Card */}
        <section
          aria-labelledby="feedback-form-title"
          className="bg-surface dark:bg-[#18241F] border border-border rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs transition-colors"
        >
          {success ? (
            <div
              role="status"
              aria-live="polite"
              className="p-8 text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-success text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold font-heading text-text-primary">
                  Thank You for Your Feedback!
                </h2>
                <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                  Your feedback has been logged directly with our engineering and operations teams. We appreciate you taking the time to help make CarPool better for everyone.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  Submit Another Feedback
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <h2 id="feedback-form-title" className="sr-only">
                Feedback Submission Form
              </h2>

              {errorMsg && (
                <div
                  role="alert"
                  className="p-3.5 bg-danger-subtle text-danger border border-red-200 dark:border-red-900/40 rounded-lg flex items-center gap-2.5 text-xs font-semibold"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Category */}
              <div>
                <label
                  htmlFor="feedback-category"
                  className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2"
                >
                  Feedback Topic *
                </label>
                <select
                  id="feedback-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full min-h-[44px] px-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="app_experience">Overall App Usability & Design</option>
                  <option value="feature_request">Feature Request / New Idea</option>
                  <option value="driver_experience">Driver Console or Ride Publishing</option>
                  <option value="pricing">Pricing & Zero Surge Policy</option>
                  <option value="general">General Suggestion</option>
                </select>
              </div>

              {/* 2. Rating (1 to 5 Stars) */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Experience Rating (Optional)
                </label>
                <div className="flex items-center gap-2" role="radiogroup" aria-label="Rating from 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || formData.rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={formData.rating === star}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        onClick={() => setFormData((p) => ({ ...p, rating: star }))}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-md text-amber-400 hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Star
                          size={28}
                          className={active ? 'fill-amber-400 text-amber-400' : 'text-border stroke-1'}
                        />
                      </button>
                    );
                  })}
                  <span className="text-xs font-bold text-text-muted ml-2">
                    {formData.rating}/5
                  </span>
                </div>
              </div>

              {/* 3. Message */}
              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5"
                >
                  Your Feedback or Suggestion *
                </label>
                <textarea
                  id="feedback-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="What worked well? What could be improved? Any feature you'd love to see?"
                  required
                  className="w-full p-3.5 text-xs sm:text-sm bg-surface dark:bg-black/20 border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  Up to 2,000 characters. Submissions are kept confidential.
                </p>
              </div>

              {/* 4. Contact Preference */}
              <div>
                <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-2">
                  Would you like us to follow up with you?
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, contactPreference: 'none' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      formData.contactPreference === 'none'
                        ? 'bg-primary-subtle border-primary text-primary shadow-xs'
                        : 'bg-surface dark:bg-black/20 border-border text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    No follow-up needed
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, contactPreference: 'email' }))}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all text-center ${
                      formData.contactPreference === 'email'
                        ? 'bg-primary-subtle border-primary text-primary shadow-xs'
                        : 'bg-surface dark:bg-black/20 border-border text-text-secondary hover:border-primary/40'
                    }`}
                  >
                    Yes, via Email
                  </button>
                </div>

                {formData.contactPreference === 'email' && (
                  <div className="mt-3 max-w-md">
                    <Input
                      label="Contact Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  leftIcon={Send}
                  className="w-full sm:w-auto min-w-[170px]"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
};

export default FeedbackPage;
