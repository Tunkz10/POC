'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, logout } from '@/lib/api';
import BookingCard from '@/components/BookingCard';

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getBookings();
        setBookings(data.bookings || []);
        
        // Show ServiceM8 error if present but still show the page
        if (data.serviceM8Error) {
          setError(data.serviceM8Error);
        }
      } catch (err) {
        if (err.message.includes('Authentication')) {
          router.push('/login');
        } else {
          setError(err.message || 'Failed to load bookings');
          // Set empty bookings so page still renders
          setBookings([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
            <p className="font-semibold">⚠️ ServiceM8 API Issue</p>
            <p className="text-sm mt-1">{error}</p>
            <p className="text-xs mt-2 text-yellow-700">
              The portal is running in demo mode. Please configure your ServiceM8 API key with proper permissions to view real bookings.
            </p>
          </div>
        )}

        {bookings.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            {error ? 'No bookings available (ServiceM8 API not connected)' : 'No bookings found'}
          </div>
        ) : (
          <div className="grid gap-4">
            {bookings.map((booking) => (
              <BookingCard key={booking.uuid} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

