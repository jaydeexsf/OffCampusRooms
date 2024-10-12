import React from 'react';
import { AiOutlineLock, AiOutlineClockCircle, AiOutlineEye, AiOutlinePhone, AiOutlineWarning } from 'react-icons/ai';

const Tips = () => {
  return (
    <div className="min-h-screen mt-8 bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Student Safety Tips</h1>
        <p className="text-gray-700 mb-4 text-center">
          Your safety is our priority! Follow these essential tips to stay safe while on and off campus.
        </p>

        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <AiOutlineLock size={32} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Lock Your Room</h2>
              <p className="text-gray-700 text-sm">
                Always lock your door when leaving your room, even if it's just for a short while. This prevents theft and unauthorized access to your belongings.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <AiOutlineClockCircle size={32} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Avoid Going to Campus After 11 PM</h2>
              <p className="text-gray-700 text-sm">
                Try to avoid walking to campus or any isolated areas late at night, especially after 11 PM. If you must go out, travel in groups or use a trusted transportation service.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <AiOutlineEye size={32} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Be Aware of Your Surroundings</h2>
              <p className="text-gray-700 text-sm">
                Stay alert and be mindful of who and what is around you at all times. Avoid distractions like looking at your phone while walking.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <AiOutlinePhone size={32} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Keep Emergency Contacts Ready</h2>
              <p className="text-gray-700 text-sm">
                Save emergency contacts on your phone, including campus security, local police, and trusted friends or family members.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <AiOutlineWarning size={32} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Report Suspicious Activity</h2>
              <p className="text-gray-700 text-sm">
                If you see any suspicious activity or feel unsafe, report it immediately to campus security or local authorities. It's always better to be safe than sorry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tips;
