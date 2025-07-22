require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// 1. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>console.log('MongoDB connected'))
  .catch((err)=>console.log('MongoDB connection error:', err));

// 2. Define Search schema/model
const Search = mongoose.model('Search', new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now }
}));

// 3. Health check route
app.get('/test', (req, res) => {
  res.send('test route works');
});

// 4. Weather route
app.get('/api/weather', async (req, res) => {
  const { city } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    // Save search to DB
    await Search.create({ city });

    // Fetch weather data
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    res.json(weatherRes.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching weather or saving search' });
  }
});

// 5. Recent searches route
app.get('/api/searches', async (req, res) => {
  try {
    const searches = await Search.find().sort({ date: -1 }).limit(10);
    res.json(searches);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});