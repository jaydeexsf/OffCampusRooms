import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiPackage, FiMapPin, FiClock, FiDollarSign, FiCheck, FiX, FiFilter, FiEye, FiMessageCircle, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const AdvancedBookings = () => {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bookingType: '',
    semester: '',
    holidayType: '',
    status: ''
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAdvancedBookings();
  }, [filters]);

  const fetchAdvancedBookings = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await apiClient.get(`${API_ENDPOINTS.GET_ADVANCED_BOOKINGS}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setBookings(response.data.rides);
      }
    } catch (error) {
      console.error('Error fetching advanced bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      const token = await getToken();
      const response = await apiClient.patch(`${API_ENDPOINTS.CONFIRM_ADVANCED_BOOKING}/${bookingId}`, {
        adminNotes: 'Booking confirmed by admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        fetchAdvancedBookings();
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const getBookingTypeIcon = (type) => {
    switch (type) {
      case 'semester_move_in':
      case 'semester_move_out':
        return <FiCalendar className="text-blue-400" />;
      case 'holiday_transport':
        return <FiClock className="text-green-400" />;
      case 'group_booking':
        return <FiUsers className="text-purple-400" />;
      default:
        return <FiMapPin className="text-gray-400" />;
    }
  };

  const getBookingTypeLabel = (type) => {
    switch (type) {
      case 'semester_move_in':
        return 'Semester Move-In';
      case 'semester_move_out':
        return 'Semester Move-Out';
      case 'holiday_transport':
        return 'Holiday Transport';
      case 'group_booking':
        return 'Group Booking';
      default:
        return 'Regular Ride';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'accepted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Function to send WhatsApp message
  const sendWhatsAppMessage = (studentContact, studentName, bookingDetails) => {
    const message = `Hi ${studentName}! Your ride booking has been confirmed.\n\n` +
      `📅 Date: ${formatDate(bookingDetails.scheduledTime)}\n` +
      `📍 From: ${bookingDetails.pickupLocation.address}\n` +
      `🎯 To: ${bookingDetails.dropoffLocation.address}\n` +
      `💰 Price: R${bookingDetails.estimatedPrice}\n\n` +
      `Please be ready at the pickup location. If you have any questions, contact us.`;
    
    const whatsappUrl = `https://wa.me/${studentContact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to send SMS message (copy to clipboard)
  const copySMSToClipboard = (studentContact, studentName, bookingDetails) => {
    const message = `Hi ${studentName}! Your ride booking has been confirmed.\n\n` +
      `📅 Date: ${formatDate(bookingDetails.scheduledTime)}\n` +
      `📍 From: ${bookingDetails.pickupLocation.address}\n` +
      `🎯 To: ${bookingDetails.dropoffLocation.address}\n` +
      `💰 Price: R${bookingDetails.estimatedPrice}\n\n` +
      `Please be ready at the pickup location. If you have any questions, contact us.`;
    
    navigator.clipboard.writeText(message).then(() => {
      alert('SMS message copied to clipboard! You can now paste it in your SMS app.');
    }).catch(() => {
      alert('Failed to copy message. Please copy manually:\n\n' + message);
    });
  };

  // Function to send WhatsApp message to driver with student booking details
  const sendWhatsAppToDriver = (driverContact, driverName, studentName, bookingDetails) => {
    const message = `Hi ${driverName}! You have a new ride assignment.\n\n` +
      `👤 Student: ${studentName}\n` +
      `📅 Date: ${formatDate(bookingDetails.scheduledTime)}\n` +
      `📍 Pickup: ${bookingDetails.pickupLocation.address}\n` +
      `🎯 Dropoff: ${bookingDetails.dropoffLocation.address}\n` +
      `💰 Price: R${bookingDetails.estimatedPrice}\n` +
      `📏 Distance: ${bookingDetails.distance} km\n\n` +
      `Please contact the student and confirm pickup time.`;
    
    const whatsappUrl = `https://wa.me/${driverContact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to copy SMS message to clipboard for driver
  const copySMSToDriver = (driverContact, driverName, studentName, bookingDetails) => {
    const message = `Hi ${driverName}! You have a new ride assignment.\n\n` +
      `👤 Student: ${studentName}\n` +
      `📅 Date: ${formatDate(bookingDetails.scheduledTime)}\n` +
      `📍 Pickup: ${bookingDetails.pickupLocation.address}\n` +
      `🎯 Dropoff: ${bookingDetails.dropoffLocation.address}\n` +
      `💰 Price: R${bookingDetails.estimatedPrice}\n` +
      `📏 Distance: ${bookingDetails.distance} km\n\n` +
      `Please contact the student and confirm pickup time.`;
    
    navigator.clipboard.writeText(message).then(() => {
      alert('Driver SMS message copied to clipboard! You can now paste it in your SMS app.');
    }).catch(() => {
      alert('Failed to copy message. Please copy manually:\n\n' + message);
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading advanced bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Advanced <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Bookings
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage semester moves, holiday transport, and group bookings</p>
          </div>

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
              <FiFilter className="text-blue-400" />
              Filters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Booking Type</label>
                <select
                  value={filters.bookingType}
                  onChange={(e) => setFilters({ ...filters, bookingType: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  <option value="">All Types</option>
                  <option value="semester_move_in">Semester Move-In</option>
                  <option value="semester_move_out">Semester Move-Out</option>
                  <option value="holiday_transport">Holiday Transport</option>
                  <option value="group_booking">Group Booking</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Semester</label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  <option value="">All Semesters</option>
                  <option value="spring">Spring</option>
                  <option value="summer">Summer</option>
                  <option value="fall">Fall</option>
                  <option value="winter">Winter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Holiday Type</label>
                <select
                  value={filters.holidayType}
                  onChange={(e) => setFilters({ ...filters, holidayType: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  <option value="">All Holidays</option>
                  <option value="christmas">Christmas</option>
                  <option value="easter">Easter</option>
                  <option value="summer_break">Summer Break</option>
                  <option value="winter_break">Winter Break</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bookings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-white/20 transition-all duration-300">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {getBookingTypeIcon(booking.bookingType)}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-semibold text-sm sm:text-base truncate">{getBookingTypeLabel(booking.bookingType)}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm truncate">{booking.studentName}</p>
                    </div>
                  </div>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)} flex-shrink-0`}>
                    {booking.status}
                  </span>
                </div>

                {/* Student Contact Information */}
                <div className="bg-white/5 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="text-blue-400 text-sm" />
                    <span className="text-gray-400 text-xs">Student Details</span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-white font-medium">{booking.studentName}</p>
                    <p className="text-gray-300">{booking.studentContact}</p>
                    <p className="text-gray-400">Booked: {formatDate(booking.createdAt || booking.scheduledTime)}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <FiMapPin className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 break-words">From: {booking.pickupLocation.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <FiMapPin className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 break-words">To: {booking.dropoffLocation.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <FiClock className="text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{formatDate(booking.scheduledTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <FiDollarSign className="text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300">R{booking.estimatedPrice}</span>
                  </div>
                  
                  {/* Advanced booking details */}
                  {booking.groupSize > 1 && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <FiUsers className="text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300">{booking.groupSize} students</span>
                    </div>
                  )}
                  
                  {booking.luggageCount > 0 && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <FiPackage className="text-orange-400 flex-shrink-0" />
                      <span className="text-gray-300">{booking.luggageCount} luggage items</span>
                    </div>
                  )}
                  
                  {booking.furnitureItems && booking.furnitureItems.length > 0 && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <FiPackage className="text-indigo-400 flex-shrink-0" />
                      <span className="text-gray-300">{booking.furnitureItems.length} furniture items</span>
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                {booking.driverId && (
                  <div className="bg-white/5 rounded-xl p-2 sm:p-3 mb-4">
                    <p className="text-white font-semibold text-xs sm:text-sm mb-1">Assigned Driver</p>
                    <p className="text-gray-300 text-xs sm:text-sm truncate">{booking.driverId.fullName}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetails(true);
                    }}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>View Details</span>
                  </button>
                  
                  {!booking.isConfirmed && booking.status === 'pending' && (
                    <button
                      onClick={() => confirmBooking(booking._id)}
                      className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Confirm</span>
                    </button>
                  )}
                </div>

                {/* Communication Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => sendWhatsAppMessage(booking.studentContact, booking.studentName, booking)}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                    title="Send WhatsApp Message"
                  >
                    <FiMessageCircle className="w-3 h-3" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>
                  
                  <button
                    onClick={() => copySMSToClipboard(booking.studentContact, booking.studentName, booking)}
                    className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                    title="Copy SMS Message"
                  >
                    <FiPhone className="w-3 h-3" />
                    <span className="hidden sm:inline">SMS</span>
                  </button>
                </div>

                {/* Driver Notification Button */}
                {booking.driverId && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => sendWhatsAppToDriver(booking.driverId.contactNumber, booking.driverId.fullName, booking.studentName, booking)}
                      className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                      title="Notify Driver via WhatsApp"
                    >
                      <FiMessageCircle className="w-3 h-3" />
                      <span className="hidden sm:inline">Notify Driver</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {bookings.length === 0 && (
            <div className="text-center py-12">
              <FiCalendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Advanced Bookings Found</h3>
              <p className="text-gray-500">No bookings match your current filters</p>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {showDetails && selectedBooking && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 sm:p-6 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-2xl font-bold text-white">Booking Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <FiX size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Basic Information</h3>
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-2 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Student:</span>
                      <span className="text-white">{selectedBooking.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Contact:</span>
                      <span className="text-white">{selectedBooking.studentContact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booking Type:</span>
                      <span className="text-white">{getBookingTypeLabel(selectedBooking.bookingType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Booked On:</span>
                      <span className="text-white">{formatDate(selectedBooking.createdAt || selectedBooking.scheduledTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Scheduled For:</span>
                      <span className="text-white">{formatDate(selectedBooking.scheduledTime)}</span>
                    </div>
                  </div>
                </div>

                {/* Communication Actions */}
                <div>
                  <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Communication</h3>
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => sendWhatsAppMessage(selectedBooking.studentContact, selectedBooking.studentName, selectedBooking)}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        Send WhatsApp
                      </button>
                      
                      <button
                        onClick={() => copySMSToClipboard(selectedBooking.studentContact, selectedBooking.studentName, selectedBooking)}
                        className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiPhone className="w-4 h-4" />
                        Copy SMS
                      </button>
                    </div>
                  </div>
                </div>

                {/* Driver Communication Section */}
                {selectedBooking.driverId && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Notify Driver</h3>
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                      <div className="mb-3 p-3 bg-white/5 rounded-lg">
                        <p className="text-gray-400 text-sm">Driver: {selectedBooking.driverId.fullName}</p>
                        <p className="text-gray-400 text-sm">Contact: {selectedBooking.driverId.contactNumber}</p>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => sendWhatsAppToDriver(selectedBooking.driverId.contactNumber, selectedBooking.driverId.fullName, selectedBooking.studentName, selectedBooking)}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <FiMessageCircle className="w-4 h-4" />
                          Driver WhatsApp
                        </button>
                        
                        <button
                          onClick={() => copySMSToDriver(selectedBooking.driverId.contactNumber, selectedBooking.driverId.fullName, selectedBooking.studentName, selectedBooking)}
                          className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <FiPhone className="w-4 h-4" />
                          Driver SMS
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Route Info */}
                <div>
                  <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Route Information</h3>
                  <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-2 text-sm sm:text-base">
                    <div>
                      <span className="text-gray-400">Pickup:</span>
                      <p className="text-white">{selectedBooking.pickupLocation.address}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Dropoff:</span>
                      <p className="text-white">{selectedBooking.dropoffLocation.address}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Distance:</span>
                      <span className="text-white">{selectedBooking.distance} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white">R{selectedBooking.estimatedPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Advanced Details */}
                {(selectedBooking.groupSize > 1 || selectedBooking.luggageCount > 0 || selectedBooking.furnitureItems?.length > 0) && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Additional Details</h3>
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-3 text-sm sm:text-base">
                      {selectedBooking.groupSize > 1 && (
                        <div>
                          <span className="text-gray-400">Group Size:</span>
                          <span className="text-white ml-2">{selectedBooking.groupSize} students</span>
                        </div>
                      )}
                      
                      {selectedBooking.luggageCount > 0 && (
                        <div>
                          <span className="text-gray-400">Luggage Count:</span>
                          <span className="text-white ml-2">{selectedBooking.luggageCount} items</span>
                        </div>
                      )}
                      
                      {selectedBooking.furnitureItems && selectedBooking.furnitureItems.length > 0 && (
                        <div>
                          <span className="text-gray-400">Furniture Items:</span>
                          <div className="mt-2 space-y-1">
                            {selectedBooking.furnitureItems.map((item, index) => (
                              <div key={index} className="text-white text-sm">
                                • {item.item} (x{item.quantity})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {(selectedBooking.notes || selectedBooking.specialRequirements) && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Notes & Requirements</h3>
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 space-y-3 text-sm sm:text-base">
                      {selectedBooking.notes && (
                        <div>
                          <span className="text-gray-400">Notes:</span>
                          <p className="text-white mt-1">{selectedBooking.notes}</p>
                        </div>
                      )}
                      
                      {selectedBooking.specialRequirements && (
                        <div>
                          <span className="text-gray-400">Special Requirements:</span>
                          <p className="text-white mt-1">{selectedBooking.specialRequirements}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Driver Info */}
                {selectedBooking.driverId && (
                  <div>
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Assigned Driver</h3>
                    <div className="bg-white/5 rounded-xl p-3 sm:p-4 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Driver:</span>
                        <span className="text-white">{selectedBooking.driverId.fullName}</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-gray-400">Contact:</span>
                        <span className="text-white">{selectedBooking.driverId.contactNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedBookings;
