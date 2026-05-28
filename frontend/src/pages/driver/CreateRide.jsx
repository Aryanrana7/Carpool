import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import LocationInput from '../../components/LocationInput';
import { MapPin, Navigation, Car, Calendar, Users, DollarSign, PlusCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreateRide = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [seats, setSeats] = useState(4);
  const [price, setPrice] = useState(10);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!source || !destination || !time) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/rides', {
        source: source.address,
        destination: destination.address,
        time,
        seats: Number(seats),
        price: Number(price),
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('driverToken')}` },
      });
      toast.success('Ride published!');
      navigate('/driver/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8f8f8] dark:bg-[#0c0c0c] flex items-start justify-center py-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <div className="mb-8">
          <p className="section-label mb-2">Driver Portal</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">Post a New Ride</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Set your route and find passengers going your way.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

            {/* Route */}
            <div className="card p-6 space-y-4">
              <p className="section-label">Route</p>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Departure</label>
                <LocationInput
                  placeholder="Where are you starting?"
                  onPlaceSelected={setSource}
                  icon={MapPin}
                  iconColor="text-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Destination</label>
                <LocationInput
                  placeholder="Where are you going?"
                  onPlaceSelected={setDestination}
                  icon={Navigation}
                  iconColor="text-violet-500"
                />
              </div>
            </div>

            {/* Trip details */}
            <div className="card p-6 space-y-4">
              <p className="section-label">Trip Details</p>

              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Departure Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <input
                    type="datetime-local"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="input-base pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Seats</label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="number" min="1" max="8" required
                      value={seats} onChange={e => setSeats(e.target.value)}
                      className="input-base pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Price / Seat</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input
                      type="number" min="0" required
                      value={price} onChange={e => setPrice(e.target.value)}
                      className="input-base pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl p-3">
                <Car size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Set a competitive price to attract more passengers. Market average is $8–15 per seat.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-success w-full py-4 text-base disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing…</span>
            ) : (
              <span className="flex items-center gap-2"><PlusCircle size={18} /> Publish Ride <ArrowRight size={18} /></span>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRide;
