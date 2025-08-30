import React, { useState, useEffect, useRef } from "react";
import myimage from '../../assets/myimage.png'
import myimage2 from '../../assets/myimage2.png'
import AbdullMalik from '../../assets/AbdullMalik.png'
import Selim from '../../assets/Selim.png'
import muhammed from '../../assets/muhammed.png'
import Ayyub from '../../assets/Ayyub.png'
import Manqoba from '../../assets/Manqoba.png'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Team data
const teamData = [
  {
    id: 1,
    name: "Johannes Ibrahim Moloantoa",
    profession: "Founder, CEO and Lead Software Engineer",
    img: myimage,
  },
  {
    id: 2,
    name: "Muhammed Ali",
    profession: "Environmentalist",
    img: muhammed
  },
  {
    id: 3,
    name: "Ayyub",
    profession: "Marketing Specialist",
    img: Ayyub
  },
  {
    id: 4,
    name: "Abdull Malik",
    profession: "Legal Represantative",
    img: AbdullMalik
  },
  {
    id: 5,
    name: "Manqoba",
    profession: "Legal Advicer",
    img: Manqoba,
  },
  {
    id: 6,
    name: "Osama bin Laka",
    profession: "Backend Developer",
    img: myimage2,
  },
  {
    id: 7,
    name: "Karabo Salim",
    profession: "Graphic Designer, Mentor and Consultant",
    img: Selim,
  },
];

const OurTeam = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);

  // Calculate slides per view based on screen size
  const getSlidesPerView = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const [slidesPerView, setSlidesPerView] = useState(getSlidesPerView());

  // Update slides per view on window resize
  useEffect(() => {
    const handleResize = () => {
      setSlidesPerView(getSlidesPerView());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const maxSlides = Math.ceil(teamData.length / slidesPerView);
    console.log('Next slide clicked, current:', currentSlide, 'maxSlides:', maxSlides);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const maxSlides = Math.ceil(teamData.length / slidesPerView);
    console.log('Prev slide clicked, current:', currentSlide, 'maxSlides:', maxSlides);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const maxSlides = Math.ceil(teamData.length / slidesPerView);

  return (
    <section className="py-16 bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet Our <span className="text-blue-400">Team</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our dedicated team of professionals is committed to providing you with the best off-campus housing experience.
          </p>
        </div>

        {/* Custom Professional Slider */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Buttons - Top Right */}
          <div className="absolute top-0 right-0 z-10 flex gap-2 mb-4">
            <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              title="Previous"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              title="Next"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slider Container */}
          <div 
            ref={sliderRef}
            className="overflow-hidden rounded-2xl"
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                width: `${teamData.length * (100 / slidesPerView)}%`
              }}
            >
              {teamData.map((member, index) => (
                <div
                  key={member.id}
                  className="flex-shrink-0 px-4"
                  style={{ width: `${100 / teamData.length}%` }}
                >
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full transition-all duration-300 hover:bg-white/10 hover:border-white/20 group">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-blue-400/30 shadow-lg group-hover:border-blue-400/50 transition-all duration-300"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                        {member.name}
                      </h3>
                      
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {member.profession}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: maxSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-blue-400 scale-110'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
