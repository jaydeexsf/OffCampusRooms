import React from 'react';

const BookingInfo = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Room Booking Information</h1>
        <p className="text-gray-700 mb-4">
          To book a room, you must contact the landlord directly and pay a non-refundable <span className="font-bold">booking fee of R100</span>. Please ensure that the landlord's bank account number matches the one provided on our platform.
        </p>
        <p className="text-gray-700 mb-4">
          The landlord will confirm the payment upon receiving it. However, if the landlord does not acknowledge the payment, please contact us at <span className="font-bold">OffCampusRoom</span> with proof of payment.
        </p>
        <p className="text-gray-700 mb-4">
          We will verify the payment details and assist you in resolving any disputes. Make sure to retain proof of all transactions.
        </p>
        <p className="text-gray-700 mb-4">
          If you have any questions, feel free to reach out to our support team.
        </p>
        <div className="mt-6">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;