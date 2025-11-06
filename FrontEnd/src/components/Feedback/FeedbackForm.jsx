import React, { useState, useEffect } from 'react';
import { FiStar, FiEdit3, FiTrash2, FiCheck, FiAlertCircle, FiSend } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const FeedbackForm = () => {
  const { getToken, isSignedIn } = useAuth();
  const [formData, setFormData] = useState({
    websiteRating: 0,
    review: '',
    location: '',
    monthlyRent: '',
    studyYear: '',
    course: '',
    roomType: ''
  });
  
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditing, setIsEditing] = useState(false);

  const studyYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'Other'];
  const roomTypes = ['Single Room', 'Shared Room', 'Studio', 'Bachelor Flat', 'Other'];

  useEffect(() => {
    if (isSignedIn) {
      fetchUserFeedback();
    }
  }, [isSignedIn]);

  const fetchUserFeedback = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(API_ENDPOINTS.GET_USER_FEEDBACK, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.feedback) {
        setExistingFeedback(response.data.feedback);
        setFormData({
          websiteRating: response.data.feedback.websiteRating,
          review: response.data.feedback.review,
          location: response.data.feedback.location,
          monthlyRent: response.data.feedback.monthlyRent,
          studyYear: response.data.feedback.studyYear,
          course: response.data.feedback.course,
          roomType: response.data.feedback.roomType
        });
      }
    } catch (error) {
      console.error('Error fetching user feedback:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      websiteRating: rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      setMessage({ type: 'error', text: 'Please sign in to submit feedback.' });
      return;
    }

    if (formData.websiteRating === 0) {
      setMessage({ type: 'error', text: 'Please provide a rating for the website.' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const token = await getToken();
      const endpoint = existingFeedback ? '/api/feedback' : '/api/feedback';
      const method = existingFeedback ? 'put' : 'post';
      
      const response = await axios[method](API_ENDPOINTS.FEEDBACK, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ 
        type: 'success', 
        text: existingFeedback ? 'Feedback updated successfully!' : 'Thank you for your feedback!' 
      });
      
      if (!existingFeedback) {
        setExistingFeedback(response.data.feedback);
      }
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error submitting feedback. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your feedback?')) return;

    setIsSubmitting(true);
    try {
      const token = await getToken();
      await axios.delete(API_ENDPOINTS.FEEDBACK, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExistingFeedback(null);
      setFormData({
        websiteRating: 0,
        review: '',
        location: '',
        monthlyRent: '',
        studyYear: '',
        course: '',
        roomType: ''
      });
      setMessage({ type: 'success', text: 'Feedback deleted successfully.' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting feedback:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error deleting feedback.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      return (
        <button
          key={index}
          type="button"
          onClick={() => handleRatingClick(starValue)}
          className={`w-8 h-8 transition-all duration-200 ${
            starValue <= formData.websiteRating
              ? 'text-yellow-400 hover:text-yellow-300'
              : 'text-gray-600 hover:text-yellow-400'
          }`}
          disabled={existingFeedback && !isEditing}
        >
          <FiStar className={`w-full h-full ${
            starValue <= formData.websiteRating ? 'fill-current' : ''
          }`} />
        </button>
      );
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-12">
              <FiAlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Sign In Required</h2>
              <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                Please sign in to share your feedback and help other students find great accommodation.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base">
                Sign In to Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-6">
              Share Your <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
              Help other University of Limpopo students by sharing your accommodation experience and rating our platform.
            </p>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
                : 'bg-gray-700/50 border-gray-600/50 text-gray-300'
            }`} data-aos="fade-up">
              <div className="flex items-center gap-2 text-sm sm:text-base">
                {message.type === 'success' ? <FiCheck /> : <FiAlertCircle />}
                {message.text}
              </div>
            </div>
          )}

          {/* Existing Feedback Display */}
          {existingFeedback && !isEditing && (
            <div className="mb-6 sm:mb-8 bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8" data-aos="fade-up">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-white">Your Feedback</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 transition-all duration-200"
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Website Rating</p>
                  <div className="flex gap-1 mb-3 sm:mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FiStar key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < existingFeedback.websiteRating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`} />
                    ))}
                  </div>
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Location</p>
                  <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base">{existingFeedback.location}</p>
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Monthly Rent</p>
                  <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base">R{existingFeedback.monthlyRent}</p>
                </div>
                
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Study Year</p>
                  <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base">{existingFeedback.studyYear}</p>
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Course</p>
                  <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base">{existingFeedback.course}</p>
                  
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Room Type</p>
                  <p className="text-white mb-3 sm:mb-4 text-sm sm:text-base">{existingFeedback.roomType}</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm mb-2">Your Review</p>
              <p className="text-white leading-relaxed text-sm sm:text-base">{existingFeedback.review}</p>
            </div>
          )}

          {/* Feedback Form */}
          {(!existingFeedback || isEditing) && (
            <form onSubmit={handleSubmit} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8" data-aos="fade-up">
              {/* Website Rating */}
              <div className="mb-6 sm:mb-8">
                <label className="block text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                  Rate Our Website *
                </label>
                <div className="flex gap-1 sm:gap-2 mb-2">
                  {renderStars()}
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {formData.websiteRating > 0 && (
                    `${formData.websiteRating} out of 5 stars`
                  )}
                </p>
              </div>

              {/* Review */}
              <div className="mb-6 sm:mb-8">
                <label htmlFor="review" className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  Your Experience *
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Share your experience with our platform and accommodation search..."
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none text-sm sm:text-base"
                />
              </div>

              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Where are you staying? *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Gate 1, Gate 2, Ga-motintane"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Monthly Rent */}
                <div>
                  <label htmlFor="monthlyRent" className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Monthly Rent (R) *
                  </label>
                  <input
                    type="number"
                    id="monthlyRent"
                    name="monthlyRent"
                    value={formData.monthlyRent}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="e.g., 2500"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Study Year */}
                <div>
                  <label htmlFor="studyYear" className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Study Year *
                  </label>
                  <select
                    id="studyYear"
                    name="studyYear"
                    value={formData.studyYear}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Select your year</option>
                    {studyYears.map(year => (
                      <option key={year} value={year} className="bg-gray-900">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course */}
                <div>
                  <label htmlFor="course" className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Course/Program *
                  </label>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Computer Science, Medicine, Law"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                {/* Room Type */}
                <div className="sm:col-span-2">
                  <label htmlFor="roomType" className="block text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                    Room Type *
                  </label>
                  <select
                    id="roomType"
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm sm:text-base"
                  >
                    <option value="">Select room type</option>
                    {roomTypes.map(type => (
                      <option key={type} value={type} className="bg-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend />
                      {existingFeedback ? 'Update Feedback' : 'Submit Feedback'}
                    </>
                  )}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form to existing feedback
                      setFormData({
                        websiteRating: existingFeedback.websiteRating,
                        review: existingFeedback.review,
                        location: existingFeedback.location,
                        monthlyRent: existingFeedback.monthlyRent,
                        studyYear: existingFeedback.studyYear,
                        course: existingFeedback.course,
                        roomType: existingFeedback.roomType
                      });
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-4 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-xl text-gray-300 font-semibold transition-all duration-200 text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
