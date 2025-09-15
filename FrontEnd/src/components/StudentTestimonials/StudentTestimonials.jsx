import React, { useState, useEffect } from 'react';
import { FiStar, FiLoader } from 'react-icons/fi';
import { apiClient } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';
import Carousel from '../Shared/Carousel';
import TestimonialCard from './TestimonialCard';

const StudentTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const url = `${API_ENDPOINTS.GET_PUBLIC_FEEDBACK}?limit=12`;
      console.log('[Testimonials] Fetch URL:', url);
      const response = await apiClient.get(url);
      console.log('[Testimonials] Response:', response.status, response.data);
      const { feedback, averageRating, total } = response.data;
      
      // Transform feedback data to match testimonial format
      const transformedTestimonials = feedback.map(item => ({
        id: item._id,
        name: item.userName || 'Anonymous',
        course: item.course ? `${item.course}${item.studyYear ? `, ${item.studyYear}` : ''}` : 'Student',
        location: item.location || 'Cape Town',
        rating: item.websiteRating || 5,
        comment: item.comment || 'Great service! Highly recommended.',
        image: item.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName || 'User')}&background=random`
      }));
      
      setTestimonials(transformedTestimonials);
      setAverageRating(averageRating || 0);
      setTotalCount(total || 0);
      setLoading(false);
    } catch (error) {
      console.error('[Testimonials] Error fetching testimonials:', error);
      console.error('[Testimonials] Error details:', error?.response?.status, error?.response?.data);
      setTestimonials([]);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  // If no testimonials, show a message
  if (!loading && testimonials.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Students Say</h2>
          <p className="text-gray-600 mb-8">No testimonials available at the moment. Check back later!</p>
        </div>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-gray-400 text-base">Loading student testimonials...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Carousel
          items={testimonials}
          renderItem={(testimonial) => <TestimonialCard testimonial={testimonial} />}
          title={
            <>
              What Our <span className="text-blue-500">Students</span> Say
            </>
          }
          subtitle={`${averageRating.toFixed(1)}/5 from ${totalCount} reviews`}
          itemsPerView={3}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </div>
    </section>
  );
};

export default StudentTestimonials;
