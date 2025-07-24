const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint to save lap times
app.post('/api/lap', (req, res) => {
  const { lap, time, split } = req.body;
  const timestamp = new Date().toISOString();
  
  const lapData = {
    lap,
    time,
    split,
    timestamp
  };
  
  // In a real app, you would save to a database
  // For this demo, we'll append to a JSON file
  const filePath = path.join(dataDir, 'laps.json');
  let laps = [];
  
  try {
    if (fs.existsSync(filePath)) {
      laps = JSON.parse(fs.readFileSync(filePath));
    }
    laps.push(lapData);
    fs.writeFileSync(filePath, JSON.stringify(laps, null, 2));
  } catch (err) {
    console.error('Error saving lap data:', err);
    return res.status(500).json({ error: 'Failed to save lap data' });
  }
  
  res.json({ success: true });
});

// API endpoint to get lap history
app.get('/api/laps', (req, res) => {
  const filePath = path.join(dataDir, 'laps.json');
  
  try {
    if (fs.existsSync(filePath)) {
      const laps = JSON.parse(fs.readFileSync(filePath));
      res.json(laps);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error('Error reading lap data:', err);
    res.status(500).json({ error: 'Failed to read lap data' });
  }
});

// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});