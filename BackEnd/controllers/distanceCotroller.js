const axios = require('axios');

const getDistance = async (req, res) => {
    const {
        myLocationLat,
        myLocationLong,
        cdestinationLat,
        destinationLong
    } = req.body;

    const myLocation = `${myLocationLat},${myLocationLong}`;
    const destination = `${cdestinationLat},${destinationLong}`;
    const apiKey = process.env.GOOGLE_API_KEY; // Store your API key securely

    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
            params: {
                origins: myLocation,
                destinations: destination,
                mode: 'walking',
                key: apiKey
            }
        });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error connecting to the Google API', error: err.message });
        console.log('Error connecting to Google Maps API:', err);
    } 
};

module.exports = { getDistance };