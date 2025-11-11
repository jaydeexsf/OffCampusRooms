import React, { useEffect, useState, useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; 
import FAQData from "../assets/FAQ'sData"; 
import { GlobalContext } from "../components/GlobalContext";

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const { faqs, isFaqLoading, fetchFAQs } = useContext(GlobalContext) || {};
  const [combinedFaqs, setCombinedFaqs] = useState(FAQData);

  useEffect(() => {
    // Fetch FAQs only when this page loads, and only once
    if (fetchFAQs && !faqs.length && !isFaqLoading) {
      fetchFAQs();
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    // Combine static FAQs with server FAQs appended under them
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      setCombinedFaqs([...FAQData, ...faqs]);
    } else {
      setCombinedFaqs(FAQData);
    }
  }, [faqs]);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Open if closed, close if open
  };

  return (
    <div className="gradient-dark bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-white leading-tight">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="md:text-sm text-xs text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about our student accommodation services. 
            Everything you need to know about booking, payments, and living arrangements.
          </p>
          {!isFaqLoading && combinedFaqs.length > 0 && (
            <p className="text-blue-400 text-sm mt-2">
              {combinedFaqs.length} questions available
            </p>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          {isFaqLoading ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading FAQs...</p>
              <p className="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 md:p-8 shadow-2xl" data-aos="fade-up" data-aos-delay="200">
              <div className="md:space-y-6 space-y-4">
                                 {combinedFaqs.map((faq, index) => (
                   <div key={index} className="border-b border-white/10 pb-6 last:border-b-0">
                     <div
                       className="flex justify-between items-center cursor-pointer group"
                       onClick={() => toggleFAQ(index)}
                     >
                       <h2 className="text-sm md:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200 pr-4">
                         {faq.question}
                       </h2>
                       <div className="flex-shrink-0">
                         {activeIndex === index ? (
                           <FaChevronUp className="text-blue-400 h-4 md:h-6 transform transition-transform duration-300" size={20} />
                         ) : (
                           <FaChevronDown className="text-gray-400 h-4 md:h-6 group-hover:text-blue-400 transition-all duration-300" size={20} />
                         )}
                       </div>
                     </div>
                     <div
                       className={`overflow-hidden transition-all duration-300 ease-in-out ${
                         activeIndex === index ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                       }`}
                     >
                       <p className="text-gray-300 text-xs md:text-sm leading-relaxed text-base">
                         {faq.answer}
                       </p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

          {/* Contact CTA */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-300 mb-6 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is here to help you 24/7.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
