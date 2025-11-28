'use client';

import { useRouter } from 'next/navigation';

export default function BookingCard({ booking }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/bookings/${booking.uuid}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {booking.job_number || `Booking ${booking.uuid?.substring(0, 8)}`}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Status:</span> {booking.status || 'N/A'}
          </p>
          {booking.date && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Date:</span>{' '}
              {new Date(booking.date).toLocaleDateString()}
              {booking.time && ` at ${booking.time}`}
            </p>
          )}
          {booking.job_address && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Address:</span> {booking.job_address}
            </p>
          )}
          {booking.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {booking.description}
            </p>
          )}
        </div>
        <div className="ml-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
}

