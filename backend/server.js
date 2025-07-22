const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/WeatherSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema & model
const cityWeatherSchema = new mongoose.Schema({
  city: String,
  country: String,
  temp: Number,
  main: String,
  weatherDesc: String,
  humidity: Number,
  wind: Number,
  searchedAt: { type: Date, default: Date.now }
});
const CityWeather = mongoose.model('CityWeather', cityWeatherSchema);

// Save search to database with logging
app.post('/api/search', async (req, res) => {
  console.log('Received data:', req.body); // <--- THIS LINE HELPS YOU DEBUG
  try {
    const weather = new CityWeather(req.body);
    await weather.save();
    res.status(201).json({ message: 'Saved!' });
  } catch (err) {
    console.error('Error saving to MongoDB:', err); // also log errors
    res.status(500).json({ error: err.message });
  }
});

// Get all searches (for testing)
app.get('/api/searches', async (req, res) => {
  const searches = await CityWeather.find().sort({ searchedAt: -1 });
  res.json(searches);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));