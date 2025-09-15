import React, { useState, useEffect, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './Carousel.css';

const Carousel = ({ 
  items, 
  renderItem, 
  title, 
  subtitle, 
  itemsPerView = 4,
  showNavigation = true,
  showPagination = true,
  autoPlay = false,
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(itemsPerView);
  
  // Handle responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleItems(1);
      else if (width < 1024) setVisibleItems(2);
      else setVisibleItems(itemsPerView);
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || items.length <= visibleItems) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [currentIndex, items.length, visibleItems, autoPlay, autoPlayInterval]);

  const nextSlide = () => {
    if (isTransitioning || items.length <= visibleItems) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(items.length / visibleItems));
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning || items.length <= visibleItems) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => 
      (prev - 1 + Math.ceil(items.length / visibleItems)) % Math.ceil(items.length / visibleItems)
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const slideOffset = -currentIndex * (100 / visibleItems);
  const totalSlides = Math.ceil(items.length / visibleItems);

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>
        {showNavigation && items.length > visibleItems && (
          <div className="carousel-navigation">
            <button 
              onClick={prevSlide} 
              className="carousel-arrow"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide} 
              className="carousel-arrow"
              aria-label="Next slide"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
      
      <div 
        ref={containerRef}
        className="carousel-track"
        style={{
          transform: `translateX(${slideOffset}%)`,
          transition: isTransitioning ? 'transform 0.3s ease' : 'none',
          width: `${(items.length / visibleItems) * 100}%`
        }}
      >
        {items.map((item, index) => (
          <div 
            key={index} 
            className="carousel-slide"
            style={{
              width: `${100 / visibleItems}%`,
              padding: '0 8px',
              flexShrink: 0
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {showPagination && totalSlides > 1 && (
        <div className="carousel-pagination">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
