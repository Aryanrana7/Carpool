import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LocationInput from '../../components/LocationInput';
import { MapPin, Navigation, Calendar, Users, PlusCircle, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

// Get local ISO string for datetime-local input (e.g. "2026-10-11T09:30")
const getInitialDepartureTime = () => {
  const d = new Date(Date.now() + 60 * 60 * 1000); // 1 hour in future
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

const CreateRide = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [seats, setSeats] = useState(4);
  const [price, setPrice] = useState(250);
  const [time, setTime] = useState(getInitialDepartureTime);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !destination || !time) {
      toast.error('Please specify pickup, destination, and departure time');
      return;
    }
    setLoading(true);
    try {
      await api.post(
        '/rides',
        {
          source: source.address,
          destination: destination.address,
          time: new Date(time).toISOString(),
          seats: Number(seats),
          price: Number(price),
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('driverToken')}` },
        }
      );
      toast.success('Scheduled ride published successfully!');
      navigate('/driver/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to publish ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background flex items-start justify-center py-8 sm:py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-6"
      >
        {/* Header */}
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider block mb-1">
            Driver Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Publish a Scheduled Ride
          </h1>
          <p className="text-text-muted mt-1 text-sm">
            Set your planned route and departure schedule to accept passenger bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            {/* Route Section */}
            <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-4 shadow-subtle">
              <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Route Information
              </h2>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Departure Origin
                </label>
                <LocationInput
                  placeholder="Where are you starting from?"
                  onPlaceSelected={setSource}
                  icon={MapPin}
                  iconColor="text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Final Destination
                </label>
                <LocationInput
                  placeholder="Where is this ride heading?"
                  onPlaceSelected={setDestination}
                  icon={Navigation}
                  iconColor="text-text-primary"
                />
              </div>
            </div>

            {/* Trip Details Section */}
            <div className="bg-surface border border-border rounded-xl p-5 sm:p-6 space-y-4 shadow-subtle">
              <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Schedule & Pricing
              </h2>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Departure Date & Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                  <input
                    type="datetime-local"
                    required
                    value={time}
                    min={new Date().toISOString().slice(0, 16)}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Available Seats
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="number"
                      min="1"
                      max="8"
                      required
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-1.5">
                    Price per Seat (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                    <input
                      type="number"
                      min="1"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors tabular-nums"
                    />
                  </div>
                </div>
              </div>

              {/* Informative Tip */}
              <div className="flex items-start gap-2.5 bg-primary-subtle border border-primary/20 rounded-lg p-3">
                <ShieldCheck size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  Published rides appear instantly in passenger route search. Fares are settled directly upon trip completion.
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full shadow-subtle"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Publishing Scheduled Route…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <PlusCircle size={18} /> Publish Scheduled Ride <ArrowRight size={18} />
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRide;
