const axios = require('axios');

const getDistance = async (req, res) => {
    const { myLocationLat, myLocationLong, destinations } = req.body;

    const myLocation = `${myLocationLat},${myLocationLong}`;
    
    // Create a pipe-separated string of destination coordinates
    const destinationString = destinations.map(d => `${d.lat},${d.long}`).join('|');
    
    const apiKey = process.env.GOOGLE_API_KEY; // Store your API key securely

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
            params: {
                origins: myLocation,
                destinations: destinationString,
                mode: 'walking',
                key: apiKey
            }
        });
        
        // Send the response back to the client
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error connecting to the Google API', error: err.message });
        console.log('Error connecting to Google Maps API:', err);
    }
};

module.exports = { getDistance };