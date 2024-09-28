import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Import icons
import FAQData from "../assets/FAQ'sData"; // Import FAQ data

const FaqPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Toggle FAQ function
  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index); // Open if closed, close if open
  };

  return (
    <div className="container mt-8 mx-auto px-4 py-[40px]">
      <h1 className="text-[26px] font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="bg-slate-20 shadow-lg rounded-lg p-4 space-y-4 max-w-3xl mx-auto">
        {FAQData.map((faq, index) => (
          <div key={index} className="border-b pb-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h2 className="text-[16px] font-semibold text-gray-800">
                {faq.question}
              </h2>
              <span>
                {activeIndex === index ? (
                  <FaChevronDown className="text-gray-600 transform rotate-180 transition-transform duration-300" />
                ) : (
                  <FaChevronDown className="text-gray-600 transition-transform duration-300" />
                )}
              </span>
            </div>
            <p
              className={`text-gray-600 mt-2 text-sm transition-all duration-0 ${
                activeIndex === index ? "max-h-full opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
