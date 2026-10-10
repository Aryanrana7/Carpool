import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Button from './ui/Button';

const RATING_TEXTS = {
  1: 'Poor experience',
  2: 'Fair experience',
  3: 'Good journey',
  4: 'Very good driver',
  5: 'Outstanding ride experience',
};

export const RatingModal = ({ isOpen, onClose, bookingId, targetName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating (1 to 5)');
      return;
    }
    if (reviewText.length > 500) {
      toast.error('Review comments cannot exceed 500 characters');
      return;
    }
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/reviews', {
        bookingId,
        rating,
        reviewText: reviewText.trim(),
      });

      toast.success('Thank you for rating your driver!');
      if (onSuccess) {
        onSuccess(bookingId, data);
      }
      setRating(0);
      setReviewText('');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit driver review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[1100] flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rating-title"
            className="w-full max-w-sm bg-surface rounded-xl shadow-modal overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="relative p-5 text-center border-b border-border bg-background">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close review dialog"
                className="absolute right-3.5 top-3.5 p-1 text-text-muted hover:text-text-primary rounded-md transition-colors"
              >
                <X size={16} />
              </button>
              <div className="w-12 h-12 mx-auto bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-full flex items-center justify-center mb-2.5 border border-amber-200 dark:border-amber-800/40">
                <Star size={24} className="fill-amber-400 text-amber-400" />
              </div>
              <h2 id="rating-title" className="text-base font-bold text-text-primary">
                Rate Driver Experience
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                How was your trip with <span className="font-semibold text-text-primary">{targetName}</span>?
              </p>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Star Rating Row */}
              <div className="flex items-center justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`Rate ${star} stars`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <Star
                      size={28}
                      className={`transition-colors ${
                        star <= (hoveredRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-border dark:text-border-subtle fill-transparent'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Text Label */}
              <p className="text-center text-xs font-semibold text-text-primary min-h-[18px]">
                {RATING_TEXTS[hoveredRating || rating] || 'Select rating'}
              </p>

              {/* Review Text */}
              <div className="space-y-1">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                  placeholder="Share feedback on driving safety, cleanliness, or route punctuality…"
                  rows={3}
                  className="input-base text-xs resize-none"
                />
                <div className="flex justify-end text-[10px] text-text-muted tabular-nums">
                  {reviewText.length}/500
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                variant="primary"
                fullWidth
                disabled={rating === 0}
                loading={isSubmitting}
                onClick={handleSubmit}
              >
                Submit Review
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RatingModal;
