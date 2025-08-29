import React from 'react';
import { getGoogleMapsApiKey } from '../../config/env';

const MapTest = () => {
  const apiKey = getGoogleMapsApiKey();
  
  const testApiKey = async () => {
    if (!apiKey) {
      alert('No API key found! Please set up your Google Maps API key first.');
      return;
    }
    
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`);
      if (response.ok) {
        alert('✅ API key is working! Google Maps should load properly.');
      } else {
        alert('❌ API key test failed. Check your key and billing status.');
      }
    } catch (error) {
      alert(`❌ Error testing API key: ${error.message}`);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
      <h3 className="text-white text-lg font-bold mb-4">🗺️ Google Maps API Key Test</h3>
      
      <div className="space-y-4">
        {/* API Key Status */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-gray-300 font-semibold mb-2">API Key Status</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">Status:</span>
              <span className={apiKey ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                {apiKey ? '✅ FOUND' : '❌ NOT FOUND'}
              </span>
            </p>
            <p>
              <span className="text-gray-400">Length:</span>
              <span className="text-blue-400 ml-2">
                {apiKey ? `${apiKey.length} characters` : 'N/A'}
              </span>
            </p>
            <p>
              <span className="text-gray-400">Preview:</span>
              <span className="text-blue-400 ml-2">
                {apiKey ? `${apiKey.substring(0, 10)}...` : 'N/A'}
              </span>
            </p>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-gray-300 font-semibold mb-2">Environment Variables</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-400">VITE_GOOGLE_MAPS_API_KEY:</span>
              <span className={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'text-green-400 ml-2' : 'text-red-400 ml-2'}>
                {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET'}
              </span>
            </p>
            <p>
              <span className="text-gray-400">NODE_ENV:</span>
              <span className="text-blue-400 ml-2">{import.meta.env.MODE || 'unknown'}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={testApiKey}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            disabled={!apiKey}
          >
            🧪 Test API Key
          </button>
          
          <button
            onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            🔑 Google Cloud Console
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg">
          <h4 className="text-blue-300 font-semibold mb-2">📋 Next Steps</h4>
          <div className="text-sm text-blue-200 space-y-1">
            {!apiKey ? (
              <>
                <p>1. Create a .env file in your FrontEnd directory</p>
                <p>2. Add: VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key</p>
                <p>3. Restart your development server</p>
                <p>4. Refresh this page to test again</p>
              </>
            ) : (
              <>
                <p>✅ API key is configured!</p>
                <p>Try viewing a room location to see the map in action.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapTest;
