import React, { useState, useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { apiClient } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';
import Carousel from '../Shared/Carousel';
import DriverCard from './DriverCard';

const DriversShowcase = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for when no drivers exist
  const getDummyDrivers = () => [
    {
      _id: 'dummy1',
      fullName: 'John Smith',
      phone: '+27 123 456 789',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      carDetails: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'White',
      },
      pricePerKm: 15,
      rating: 4.8,
      totalRides: 156,
      experience: '5 years',
      location: 'Pretoria, Gauteng',
      bio: 'Professional driver with 5+ years of experience.',
    },
    // More dummy drivers...
  ];

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const url = API_ENDPOINTS.GET_DRIVERS || '/api/drivers';
      const response = await apiClient.get(url);
      setDrivers(response.data?.length ? response.data : getDummyDrivers());
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers(getDummyDrivers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <FiLoader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p>Loading drivers...</p>
        </div>
      </section>
    );
  }

  if (!drivers.length) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p>No drivers available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Carousel
          items={drivers}
          renderItem={(driver) => <DriverCard driver={driver} />}
          title="Our Trusted Drivers"
          subtitle="Professional drivers ready to assist you"
          itemsPerView={3}
          autoPlay={true}
          autoPlayInterval={5000}
        />
      </div>
    </section>
  );
};

export default DriversShowcase;
