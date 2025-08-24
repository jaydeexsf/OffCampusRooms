import React from 'react';
import ProfessionalRatingSystem from './ProfessionalRatingSystem';
import RoomRatingActions from './RoomRatingActions';

/**
 * Example component showing how to use the new professional rating system
 * 
 * Usage Examples:
 * 
 * 1. Full Rating Interface (for room detail pages):
 * <ProfessionalRatingSystem roomId="123" roomTitle="Cozy Studio Apartment" />
 * 
 * 2. Compact Rating Display (for room cards/lists):
 * <ProfessionalRatingSystem roomId="123" roomTitle="Cozy Studio Apartment" compact={true} />
 * 
 * 3. Action Buttons Only (for custom layouts):
 * <RoomRatingActions roomId="123" roomTitle="Cozy Studio Apartment" />
 */

const RatingSystemExample = () => {
  // Example room data
  const exampleRoom = {
    id: "64f8b2c3e4b0a1b2c3d4e5f6",
    title: "Modern Studio Near Campus",
    description: "Beautiful studio apartment with all amenities"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Professional Rating System</h1>
          <p className="text-gray-300 text-lg">Examples of the new rating components in action</p>
        </div>

        {/* Full Rating Interface Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Full Rating Interface</h2>
          <p className="text-gray-400">Perfect for room detail pages - shows complete rating summary with action buttons</p>
          <ProfessionalRatingSystem 
            roomId={exampleRoom.id} 
            roomTitle={exampleRoom.title}
          />
        </div>

        {/* Compact Rating Display Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Compact Rating Display</h2>
          <p className="text-gray-400">Ideal for room cards and lists - minimal space usage</p>
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">{exampleRoom.title}</h3>
                <p className="text-gray-400 text-sm">{exampleRoom.description}</p>
              </div>
              <ProfessionalRatingSystem 
                roomId={exampleRoom.id} 
                roomTitle={exampleRoom.title}
                compact={true}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Only Example */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Action Buttons Only</h2>
          <p className="text-gray-400">For custom layouts where you want just the rating actions</p>
          <RoomRatingActions 
            roomId={exampleRoom.id} 
            roomTitle={exampleRoom.title}
          />
        </div>

        {/* Integration Guide */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Integration Guide</h2>
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">1. Room Detail Pages</h3>
              <p>Use the full <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">ProfessionalRatingSystem</code> component</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">2. Room Cards/Lists</h3>
              <p>Use the compact version: <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">compact={true}</code></p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">3. Custom Layouts</h3>
              <p>Use <code className="bg-gray-800 px-2 py-1 rounded text-blue-300">RoomRatingActions</code> for just the buttons</p>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/20 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div className="space-y-2">
              <h3 className="text-white font-medium">✨ Professional Design</h3>
              <p className="text-sm">Modern glass-morphism UI with smooth animations</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">🔐 Authentication Aware</h3>
              <p className="text-sm">Works with or without user login</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">📱 Responsive</h3>
              <p className="text-sm">Adapts to all screen sizes</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">⚡ Performance Optimized</h3>
              <p className="text-sm">Pagination and efficient data loading</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">🎨 Customizable</h3>
              <p className="text-sm">Multiple display modes and styling options</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">🚀 Easy Integration</h3>
              <p className="text-sm">Drop-in replacement for existing components</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingSystemExample;
