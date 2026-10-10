import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, Smartphone, Wallet, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/ui/Button';

const METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
  { id: 'upi', label: 'UPI Instant Payment', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'wallet', label: 'Carpool Wallet', icon: Wallet, desc: 'Account mobility balance' },
];

export const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isMountedRef = useRef(true);
  const paymentTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (paymentTimerRef.current) clearTimeout(paymentTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  const ride = location.state?.ride;

  if (!ride) {
    return <Navigate to="/" replace />;
  }

  const handlePayment = () => {
    setLoading(true);
    paymentTimerRef.current = setTimeout(async () => {
      try {
        await api.post('/bookings', { rideId: ride._id });
        if (!isMountedRef.current) return;
        setSuccess(true);
        toast.success('Payment authorized and ride booked successfully');
        redirectTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            navigate('/my-rides');
          }
        }, 1800);
      } catch (err) {
        if (!isMountedRef.current) return;
        const status = err.response?.status;
        const msg = err.response?.data?.message || 'Payment authorization failed.';

        toast.error(msg);

        if (status === 400 || status === 404) {
          redirectTimerRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              navigate('/', { replace: true });
            }
          }, 1800);
        } else {
          setLoading(false);
        }
      }
    }, 900);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-sm bg-surface border border-border p-8 rounded-xl shadow-modal">
          <div className="w-14 h-14 bg-success-subtle text-success rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-1">
            Booking Confirmed!
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed mb-6">
            Your seat reservation is confirmed. Redirecting you to My Trips…
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/my-rides')}
          >
            Go to My Trips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-68px)] bg-background flex justify-center items-start py-8 px-4 sm:px-6">
      <div className="w-full max-w-lg space-y-5">
        {/* Step Header */}
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary-subtle px-2 py-0.5 rounded">
              Step 2 of 2
            </span>
            <span className="text-xs text-text-muted">Payment</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Select Payment Method
          </h1>
          <p className="text-text-secondary mt-1 text-xs">
            Complete your seat reservation with encrypted simulated checkout.
          </p>
        </div>

        {/* Amount Due Card */}
        <div className="bg-surface border border-border rounded-lg p-5 flex items-center justify-between">
          <div>
            <p className="micro-label mb-1">Total Due</p>
            <p className="text-2xl font-bold text-text-primary tabular-nums">
              {formatCurrency(ride.price)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-text-primary">{ride.carType || 'Standard Vehicle'}</p>
            <p className="text-[11px] text-text-muted mt-0.5">1 seat confirmed</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border">
            <p className="micro-label">Payment Options</p>
          </div>
          <div className="p-3 space-y-2">
            {METHODS.map(({ id, label, icon: MethodIcon, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-md border transition-all text-left cursor-pointer ${
                  method === id
                    ? 'border-primary bg-primary-subtle'
                    : 'border-border bg-surface hover:bg-background'
                }`}
              >
                <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                  method === id ? 'bg-primary text-white' : 'bg-border-subtle text-text-secondary'
                }`}>
                  <MethodIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text-primary">{label}</p>
                  <p className="text-[11px] text-text-muted truncate">{desc}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  method === id ? 'border-primary' : 'border-border'
                }`}>
                  {method === id && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-2 text-xs text-text-muted justify-center">
          <ShieldCheck size={14} className="text-primary" />
          <span>Encrypted payment authorization · Direct driver settlement</span>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          fullWidth
          loading={loading}
          onClick={handlePayment}
          rightIcon={ArrowRight}
        >
          {loading ? 'Authorizing Payment…' : `Pay ${formatCurrency(ride.price)} & Confirm Booking`}
        </Button>
      </div>
    </div>
  );
};

export default Payment;
