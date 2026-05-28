import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { CheckCircle, MapPin, Navigation, Car, User } from 'lucide-react';

const RideConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!ride) {
    return (
      <div className="pt-24 text-center">
        <p className="text-xl">No ride selected.</p>
        <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Go back home</button>
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', { rideId: ride._id });
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-rides');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book the ride.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16">
        <div className="text-center">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
          <p className="text-gray-500 mt-2">Redirecting to your rides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-6 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="bg-black text-white p-8">
          <h1 className="text-3xl font-bold">Confirm your ride</h1>
        </div>

        <div className="p-8">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</div>}

          {/* Route Info */}
          <div className="relative pl-6 mb-8">
            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            <div className="relative mb-6">
              <div className="absolute -left-6 top-0.5 w-3 h-3 bg-black rounded-full"></div>
              <p className="text-sm text-gray-500 font-medium">Pickup</p>
              <p className="text-lg font-semibold">{ride.source}</p>
            </div>
            
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-3 h-3 bg-black rounded-none"></div>
              <p className="text-sm text-gray-500 font-medium">Dropoff</p>
              <p className="text-lg font-semibold">{ride.destination}</p>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Driver & Car Info */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
               </div>
               <div>
                 <p className="font-bold text-lg">{ride.driver?.name || 'Driver'}</p>
                 <p className="text-sm text-gray-500">Rating: {ride.driver?.rating || 'New'} ★</p>
               </div>
            </div>
            <div className="text-right">
               <Car size={32} className="text-gray-400 mx-auto" />
               <p className="text-sm font-medium mt-1">Standard</p>
            </div>
          </div>

          <hr className="border-gray-100 my-6" />

          {/* Price */}
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-medium text-gray-500">Total Price</span>
            <span className="text-3xl font-bold">${ride.price}</span>
          </div>

          <button 
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-black text-white text-lg font-medium py-4 rounded-lg hover:bg-gray-900 transition-colors flex justify-center items-center"
          >
            {loading ? <Loader /> : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RideConfirmation;
