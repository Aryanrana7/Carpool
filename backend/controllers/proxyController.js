const axios = require('axios');

exports.geocode = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        format: 'json',
        q: q,
        limit: 5,
      },
      headers: {
        'User-Agent': 'CarpoolApp/1.0',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Nominatim proxy error:', error.message);
    res.status(502).json({ message: 'Error fetching geocode data' });
  }
};

exports.reverse = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ message: 'lat and lon are required' });

  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'json',
        lat,
        lon,
      },
      headers: {
        'User-Agent': 'CarpoolApp/1.0',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Nominatim reverse proxy error:', error.message);
    res.status(502).json({ message: 'Error fetching reverse geocode data' });
  }
};
