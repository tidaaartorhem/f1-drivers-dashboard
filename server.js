const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();

// Enable CORS for all routes to allow the front‑end to request the API without issues
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * GET /api/drivers
 *
 * Fetches the latest driver information from the OpenF1 API.  The OpenF1
 * "drivers" endpoint returns details such as the driver’s full name,
 * team name, country code and headshot URL.  This route
 * proxies that request so the client can call a relative URL without
 * worrying about CORS or query parameters.
 */
app.get('/api/drivers', async (req, res) => {
  try {
    // Use the "latest" session to get current drivers.  See OpenF1 docs for details.
    const url = 'https://api.openf1.org/v1/drivers?session_key=latest';
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `OpenF1 responded with status ${response.status}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to retrieve driver data' });
  }
});

// Fallback: serve index.html for any unknown routes.  This allows client‑side
// routing to work when deployed behind a history API fallback.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`F1 dashboard server listening on port ${PORT}`);
});
