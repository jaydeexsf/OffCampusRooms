import React from 'react';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const LatestNews = () => {
  const newsArticles = [
    {
      id: 1,
      title: "Complete Guide to Moving into Student Accommodation",
      excerpt: "Everything you need to know about moving into your new student room, from what to pack to how to settle in quickly.",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Moving Guide",
      readTime: "5 min read",
      date: "2024-01-15",
      featured: true
    },
    {
      id: 2,
      title: "Budget-Friendly Student Accommodation Tips",
      excerpt: "Learn how to find affordable accommodation without compromising on quality and safety near University of Limpopo.",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Budget Tips",
      readTime: "4 min read",
      date: "2024-01-12"
    },
    {
      id: 3,
      title: "Safety Tips for Students Living Off-Campus",
      excerpt: "Essential safety guidelines to keep you secure while living in student accommodation around the University of Limpopo.",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Safety",
      readTime: "6 min read",
      date: "2024-01-10"
    },
    {
      id: 4,
      title: "Best Study Spots Near University of Limpopo",
      excerpt: "Discover the top study locations and libraries around campus for the perfect study environment.",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "Campus Life",
      readTime: "3 min read",
      date: "2024-01-08"
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Latest <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Student Tips
              </span> & News
            </h2>
          </div>

          {/* Featured Article */}
          <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
            {newsArticles.filter(article => article.featured).map((article) => (
              <div key={article.id} className="relative overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl group transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 lg:h-full overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(article.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <FiClock className="w-4 h-4" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-200">
                      {article.title}
                    </h3>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      {article.excerpt}
                    </p>

                    <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 group">
                      <span>Read Full Article</span>
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="400">
            {newsArticles.filter(article => !article.featured).map((article) => (
              <div 
                key={article.id}
                className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden group transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/30">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3 text-gray-400 text-xs">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      <span>{formatDate(article.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-200">
                    {article.title}
                  </h4>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  <button className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors duration-200 group">
                    <span>Read More</span>
                    <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Stay Updated with Student Tips
              </h3>
              <p className="text-gray-300 mb-6">
                Get the latest accommodation tips, campus life updates, and student resources delivered to your inbox
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
