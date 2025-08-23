import React, { useState } from 'react';
import { FiCalculator, FiMapPin, FiFileText, FiPhone, FiMail, FiClock, FiShield, FiHome, FiUsers, FiDollarSign } from 'react-icons/fi';
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
      icon: <FiShield className="w-6 h-6" />,
      title: "Always Lock Your Room",
      description: "Keep your room locked even when you're just stepping out briefly. This prevents theft and unauthorized access."
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Avoid Late Night Travel",
      description: "Try to avoid walking alone late at night, especially after 11 PM. Travel in groups or use trusted transportation."
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: "Keep Emergency Contacts Ready",
      description: "Save important numbers on your phone and keep a written list in your room for easy access."
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Student <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Resources
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Essential tools, guides, and information to help you succeed at University of Limpopo
          </p>
        </div>

        {/* Budget Calculator */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <FiCalculator className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Student Budget Calculator</h2>
            <p className="text-gray-400">Plan your monthly expenses and track your budget</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-white font-medium mb-2">Monthly Income (R)</label>
                <input
                  type="number"
                  value={budget.income}
                  onChange={(e) => setBudget({...budget, income: Number(e.target.value)})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">Rent (R)</label>
                  <input
                    type="number"
                    value={budget.rent}
                    onChange={(e) => setBudget({...budget, rent: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Utilities (R)</label>
                  <input
                    type="number"
                    value={budget.utilities}
                    onChange={(e) => setBudget({...budget, utilities: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Food (R)</label>
                  <input
                    type="number"
                    value={budget.food}
                    onChange={(e) => setBudget({...budget, food: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Transport (R)</label>
                  <input
                    type="number"
                    value={budget.transport}
                    onChange={(e) => setBudget({...budget, transport: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Books (R)</label>
                  <input
                    type="number"
                    value={budget.books}
                    onChange={(e) => setBudget({...budget, books: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Entertainment (R)</label>
                  <input
                    type="number"
                    value={budget.entertainment}
                    onChange={(e) => setBudget({...budget, entertainment: Number(e.target.value)})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <button
                onClick={calculateBudget}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Calculate Budget
              </button>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">Monthly Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Income:</span>
                    <span className="text-green-400 font-semibold">R{budget.income.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Expenses:</span>
                    <span className="text-red-400 font-semibold">R{totalExpenses.toLocaleString()}</span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between">
                    <span className="text-gray-300">Remaining:</span>
                    <span className={`font-semibold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      R{remaining.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {remaining < 0 && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <p className="text-red-400 text-sm">
                    ⚠️ Your expenses exceed your income. Consider reducing some costs or finding additional income sources.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <FiPhone className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Emergency Contacts</h2>
            <p className="text-gray-400">Important numbers to keep handy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">{contact.name}</h3>
                <p className="text-gray-400 text-sm mb-3">{contact.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-green-400" />
                      <span className="text-white">{contact.email}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moving Checklist */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <FiFileText className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Moving Checklist</h2>
            <p className="text-gray-400">Everything you need when moving into student accommodation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {movingChecklist.map((category, index) => (
              <div key={index} className="bg-black/30 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">{category.category}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12">
          <div className="text-center mb-8">
            <FiShield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Safety Tips</h2>
            <p className="text-gray-400">Stay safe while living in student accommodation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safetyTips.map((tip, index) => (
              <div key={index} className="bg-black/30 border border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-blue-400 mt-1">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
                    <p className="text-gray-300 text-sm">{tip.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need More Help?
            </h3>
            <p className="text-gray-300 mb-6">
              Contact our student support team for personalized assistance with accommodation and campus life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200"
              >
                Contact Support
              </Link>
              <Link 
                to="/tips"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 border border-white/20"
              >
                Safety Tips
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResources;
