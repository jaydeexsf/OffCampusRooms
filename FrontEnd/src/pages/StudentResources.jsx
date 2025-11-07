import React, { useState } from 'react';
import { FiGrid, FiMapPin, FiFileText, FiPhone, FiMail, FiClock, FiShield, FiHome, FiUsers, FiDollarSign } from 'react-icons/fi';
import { AiOutlineLock, AiOutlineClockCircle, AiOutlineEye, AiOutlinePhone, AiOutlineWarning } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const StudentResources = () => {
  const [budget, setBudget] = useState({
    income: 0,
    rent: 0,
    utilities: 0,
    food: 0,
    transport: 0,
    books: 0,
    entertainment: 0
  });

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const calculateBudget = () => {
    const expenses = budget.rent + budget.utilities + budget.food + budget.transport + budget.books + budget.entertainment;
    setTotalExpenses(expenses);
    setRemaining(budget.income - expenses);
  };

  const emergencyContacts = [
    {
      name: "University of Limpopo Security",
      phone: "+27 15 268 9111",
      email: "security@ul.ac.za",
      description: "24/7 campus security services"
    },
    {
      name: "University of Limpopo Student Services",
      phone: "+27 15 268 9111",
      email: "studentservices@ul.ac.za",
      description: "Student support and accommodation assistance"
    },
    {
      name: "Local Police Station",
      phone: "+27 15 287 5000",
      email: "",
      description: "Mankweng Police Station"
    },
    {
      name: "Emergency Services",
      phone: "112",
      email: "",
      description: "National emergency number"
    }
  ];

  const movingChecklist = [
    {
      category: "Essential Documents",
      items: [
        "Student ID",
        "Passport/ID Book",
        "Medical aid details",
        "Bank account details",
        "Emergency contact list"
      ]
    },
    {
      category: "Bedroom Essentials",
      items: [
        "Bedding (sheets, pillow, blanket)",
        "Towels",
        "Clothes hangers",
        "Storage boxes",
        "Desk lamp"
      ]
    },
    {
      category: "Kitchen Items",
      items: [
        "Basic cooking utensils",
        "Plates, cups, cutlery",
        "Food storage containers",
        "Cleaning supplies",
        "Small appliances"
      ]
    },
    {
      category: "Study Materials",
      items: [
        "Notebooks and pens",
        "Laptop and charger",
        "Desk organizer",
        "Study lamp",
        "Textbooks"
      ]
    }
  ];

  const safetyTips = [
    {
      icon: <AiOutlineLock className="w-6 h-6" />,
      title: "Lock Your Room",
      description: "Always lock your door when leaving your room, even if it's just for a short while. This prevents theft and unauthorized access to your belongings."
    },
    {
      icon: <AiOutlineClockCircle className="w-6 h-6" />,
      title: "Avoid Going to or coming from Campus After 11 PM",
      description: "Try to avoid walking to campus or any isolated areas late at night, especially after 11 PM. If you must go out, travel in groups or use a trusted transportation service."
    },
    {
      icon: <AiOutlineEye className="w-6 h-6" />,
      title: "Be Aware of Your Surroundings",
      description: "Stay alert and be mindful of who and what is around you at all times. Avoid distractions like looking at your phone while walking."
    },
    {
      icon: <AiOutlinePhone className="w-6 h-6" />,
      title: "Keep Emergency Contacts Ready",
      description: "Save emergency contacts on your phone, including campus security, local police, and trusted friends or family members."
    },
    {
      icon: <AiOutlineWarning className="w-6 h-6" />,
      title: "Report Suspicious Activity",
      description: "If you see any suspicious activity or feel unsafe, report it immediately to campus security or local authorities. It's always better to be safe than sorry."
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Get to Know Your Neighbors",
      description: "Build relationships with your neighbors and roommates. They can be your first line of support in emergencies."
    }
  ];


  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="mt-24 sm:mt-28 text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Student <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-2">
            Essential tools, guides, and information to help you succeed at University of Limpopo
          </p>
        </div>


        {/* Budget Calculator */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
                         <FiGrid className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Student Budget Calculator</h2>
            <p className="text-gray-400 text-sm sm:text-base">Plan your monthly expenses and track your budget</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Input Form */}
            <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Monthly Income (R)</label>
                  <input
                    type="number"
                    value={budget.income}
                    onChange={(e) => setBudget({...budget, income: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Rent (R)</label>
                  <input
                    type="number"
                    value={budget.rent}
                    onChange={(e) => setBudget({...budget, rent: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Utilities (R)</label>
                  <input
                    type="number"
                    value={budget.utilities}
                    onChange={(e) => setBudget({...budget, utilities: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Food (R)</label>
                  <input
                    type="number"
                    value={budget.food}
                    onChange={(e) => setBudget({...budget, food: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Transport (R)</label>
                  <input
                    type="number"
                    value={budget.transport}
                    onChange={(e) => setBudget({...budget, transport: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="min-[380px]:col-span-1">
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Books (R)</label>
                  <input
                    type="number"
                    value={budget.books}
                    onChange={(e) => setBudget({...budget, books: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="min-[380px]:col-span-1">
                  <label className="block text-white font-medium mb-2 text-sm sm:text-base">Entertainment (R)</label>
                  <input
                    type="number"
                    value={budget.entertainment}
                    onChange={(e) => setBudget({...budget, entertainment: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                onClick={calculateBudget}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                Calculate Budget
              </button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Monthly Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">Total Income:</span>
                    <span className="text-green-400 font-semibold text-sm sm:text-base">R{budget.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">Total Expenses:</span>
                    <span className="text-red-400 font-semibold text-sm sm:text-base">R{totalExpenses.toLocaleString()}</span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm sm:text-base">Remaining:</span>
                    <span className={`font-semibold text-sm sm:text-base ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R{remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {remaining < 0 && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 sm:p-4">
                  <p className="text-red-400 text-xs sm:text-sm">
                    ⚠️ Your expenses exceed your income. Consider reducing some costs or finding additional income sources.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <FiPhone className="w-8 h-8 sm:w-12 sm:h-12 text-red-400 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Emergency Contacts</h2>
            <p className="text-gray-400 text-sm sm:text-base">Important numbers to keep handy</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-xl p-4 sm:p-6 hover:from-blue-600/30 hover:to-blue-500/30 transition-all duration-300">
                <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{contact.name}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-3">{contact.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-xs sm:text-sm">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-green-400" />
                      <span className="text-white text-xs sm:text-sm">{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

       
        {/* Safety Tips */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12" data-aos="fade-up">
          <div className="text-center mb-8 sm:mb-12">
            <FiShield className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Student Safety Tips
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto px-2">
              Your safety is our priority! Follow these essential tips to stay safe while on and off campus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {safetyTips.map((tip, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-600/20 to-purple-500/10 border border-blue-500/25 rounded-2xl p-4 sm:p-6 hover:border-blue-400/40 transition-all duration-300 group">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="text-blue-300 mt-1 group-hover:text-blue-200 transition-colors duration-300">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 group-hover:text-blue-100 transition-colors duration-300 text-sm sm:text-base lg:text-lg">{tip.title}</h3>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
              Contact our student support team for personalized assistance with accommodation and campus life
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                to="/contact"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base"
              >
                Contact Support
              </Link>
              <Link 
                to="/feedback"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-200 border border-white/20 text-sm sm:text-base"
              >
                Share Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResources;
