import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import HomeIcon from "@mui/icons-material/Home";
import Sidebar from "./Sidebar";
import WeatherPanel from "./WeatherPanel";
import CommunityAlerts from "./CommunityAlerts";
import { useTranslation } from "react-i18next";
import SplashScreen from "./components/SplashScreen"; // Splash screen import

const OPEN_WEATHER_API_KEY = "055a36d0e28104f0c280cbcab0c784e4";

const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" }
];

const otherCities = [
  { name: "Yaounde", country: "CM", lat: 3.8480, lon: 11.5021 },
  { name: "Bamenda", country: "CM", lat: 5.9631, lon: 10.1591 },
  { name: "Buea", country: "CM", lat: 4.1527, lon: 9.2415 }
];

function processForecastToDaily(forecastList, language = "en") {
  if (!forecastList || forecastList.length === 0) return [];
  const days = {};
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString(language, { weekday: "short" });
    if (!days[day]) {
      days[day] = {
        temps: [],
        types: {},
        descriptions: {},
        icon: item.weather[0].main
      };
    }
    days[day].temps.push(item.main.temp);
    days[day].types[item.weather[0].main] =
      (days[day].types[item.weather[0].main] || 0) + 1;
    days[day].descriptions[item.weather[0].description] =
      (days[day].descriptions[item.weather[0].description] || 0) + 1;
  });
  return Object.entries(days).map(([day, data]) => {
    const maxTemp = Math.round(Math.max(...data.temps));
    const mainType = Object.entries(data.types).sort((a, b) => b[1] - a[1])[0][0];
    const description = Object.entries(data.descriptions).sort((a, b) => b[1] - a[1])[0][0];
    return {
      day,
      temp: maxTemp,
      type: mainType,
      description
    };
  });
}

// --- MongoDB saving function ---
async function saveSearchToMongo(weatherObj) {
  console.log('Saving to MongoDB:', weatherObj); // Debug log
  try {
    await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(weatherObj)
    });
  } catch (err) {
    console.error('Failed to save search:', err);
  }
}

export default function App() {
  const { t, i18n } = useTranslation();

  // Splash screen state
  const [showSplash, setShowSplash] = useState(true);

  // All other state hooks
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [aqiData, setAqiData] = useState(null);
  const [otherCitiesData, setOtherCitiesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [language, setLanguage] = useState(i18n.language || "en");
  const [searchQuery, setSearchQuery] = useState("");
  const [recent, setRecent] = useState([]);
  const [activePanel, setActivePanel] = useState("mainWeather");
  const [role, setRole] = useState("general");

  const [langAnchorEl, setLangAnchorEl] = useState(null);
  const langMenuOpen = Boolean(langAnchorEl);
  const handleLangClick = (event) => setLangAnchorEl(event.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);
  const handleLangSelect = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    handleLangClose();
  };

  // Splash screen timer effect
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);

  // Weather and other cities effects
  useEffect(() => {
    getWeatherForGeolocation();
    // eslint-disable-next-line
  }, [language]);

  useEffect(() => {
    fetchOtherCities();
    // eslint-disable-next-line
  }, [language]);

  function getWeatherForGeolocation() {
    setLoading(true);
    setLocationError("");
    setActivePanel("mainWeather");
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=${language}`
          );
          const data = await res.json();
          if (data.cod !== 200) {
            setLocationError("Could not fetch weather for your location");
            setWeather(null);
            setForecast([]);
            setAqiData(null);
          } else {
            setWeather({
              city: `${data.name}, ${data.sys.country}`,
              temp: Math.round(data.main.temp),
              main: data.weather[0].main,
              weatherDesc: data.weather[0].description,
              humidity: data.main.humidity,
              wind: data.wind.speed,
              pressure: data.main.pressure,
              feels_like: Math.round(data.main.feels_like),
              sunrise: data.sys.sunrise,
              sunset: data.sys.sunset,
              timezone: data.timezone,
              country: data.sys.country,
              lat: data.coord.lat,
              lon: data.coord.lon
            });
            fetchForecast(data.coord.lat, data.coord.lon);
            fetchAqi(data.coord.lat, data.coord.lon);
          }
        } catch (e) {
          setLocationError("Error fetching weather for your location");
          setWeather(null);
          setForecast([]);
          setAqiData(null);
        }
        setLoading(false);
      },
      (err) => {
        setLocationError("Location permission denied or unavailable.");
        setWeather(null);
        setForecast([]);
        setAqiData(null);
        setLoading(false);
      }
    );
  }

  // --- Save to MongoDB after successful search ---
  async function handleSearch(city) {
    if (!city.trim()) return;
    setLoading(true);
    setActivePanel("mainWeather");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=${language}`
      );
      const data = await res.json();
      if (data.cod !== 200) {
        alert("City not found.");
      } else {
        const weatherObj = {
          city: `${data.name}, ${data.sys.country}`,
          country: data.sys.country,
          temp: Math.round(data.main.temp),
          main: data.weather[0].main,
          weatherDesc: data.weather[0].description,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          searchedAt: new Date()
        };
        setWeather({
          city: weatherObj.city,
          temp: weatherObj.temp,
          main: weatherObj.main,
          weatherDesc: weatherObj.weatherDesc,
          humidity: weatherObj.humidity,
          wind: weatherObj.wind,
          pressure: data.main.pressure,
          feels_like: Math.round(data.main.feels_like),
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          timezone: data.timezone,
          country: data.sys.country,
          lat: data.coord.lat,
          lon: data.coord.lon
        });
        // Save to MongoDB
        saveSearchToMongo(weatherObj);
        setAqiData(null);
        setRecent((prev) => [
          { city: weatherObj.city, temp: weatherObj.temp, main: weatherObj.main },
          ...prev.filter((r) => r.city !== weatherObj.city)
        ]);
        setLocationError("");
        fetchForecast(data.coord.lat, data.coord.lon);
        fetchAqi(data.coord.lat, data.coord.lon);
      }
    } catch (err) {
      alert("Error fetching weather data.");
    }
    setLoading(false);
  }

  async function fetchForecast(lat, lon) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=${language}`
      );
      const data = await res.json();
      if (!data.list) {
        setForecast([]);
        return;
      }
      setForecast(processForecastToDaily(data.list, language));
    } catch {
      setForecast([]);
    }
  }

  async function fetchAqi(lat, lon) {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`
      );
      const data = await res.json();
      setAqiData(data.list && data.list[0]);
    } catch {
      setAqiData(null);
    }
  }

  async function fetchOtherCities() {
    const results = await Promise.all(
      otherCities.map(async (city) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=${language}`
          );
          const data = await res.json();
          return {
            name: city.name,
            country: city.country,
            temp: Math.round(data.main.temp),
            weather: data.weather[0]?.main,
            weatherDesc: data.weather[0]?.description,
            wind: data.wind.speed,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            sunrise: data.sys?.sunrise,
            sunset: data.sys?.sunset,
            timezone: data.timezone
          };
        } catch {
          return {
            name: city.name,
            country: city.country,
            error: "N/A"
          };
        }
      })
    );
    setOtherCitiesData(results);
  }

  function handleOtherCityClick(cityObj) {
    handleSearch(cityObj.name);
    setActivePanel("mainWeather");
  }

  function handlePanelSelect(panel) {
    setActivePanel(panel);
  }

  const handleGoHome = () => setActivePanel("mainWeather");

  // Show splash screen before app loads
  if (showSplash) return <SplashScreen />;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#23242c" }}>
      <AppBar position="static" sx={{ background: "#1e2235", boxShadow: "0 4px 24px #0002" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src="/logo.png" // Change to your logo if desired
              alt="Logo"
              style={{ height: 40, marginRight: 14, filter: "drop-shadow(0 2px 8px #0003)" }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, color: "#fff" }}>
              {t("weatherSystem")}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              startIcon={<HomeIcon />}
              sx={{ color: "#fff", textTransform: "none", fontWeight: 500 }}
              onClick={handleGoHome}
            >
              Home
            </Button>
            <Button
              startIcon={<LanguageIcon />}
              sx={{ color: "#fff", textTransform: "none", fontWeight: 500 }}
              onClick={handleLangClick}
            >
              {supportedLanguages.find((l) => l.code === language)?.name || "Language"}
            </Button>
            <Menu anchorEl={langAnchorEl} open={langMenuOpen} onClose={handleLangClose}>
              {supportedLanguages.map((lang) => (
                <MenuItem
                  key={lang.code}
                  selected={lang.code === language}
                  onClick={() => handleLangSelect(lang.code)}
                >
                  {lang.name}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          backgroundImage: `url('/weather-bg/bg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        <Sidebar
          search={searchQuery}
          setSearch={setSearchQuery}
          handleSearch={() => handleSearch(searchQuery)}
          loading={loading}
          recent={recent || []}
          weather={weather}
          locationError={locationError}
          getWeatherForGeolocation={getWeatherForGeolocation}
          onPanelSelect={handlePanelSelect}
          role={role}
          setRole={setRole}
          lang={language}
        />
        <Box sx={{ flex: 1, ml: { xs: 0, sm: 4, md: 8 } }}>
          {activePanel === "communityAlerts" ? (
            <CommunityAlerts city={weather?.city} lang={language} />
          ) : (
            <WeatherPanel
              weather={weather}
              forecast={forecast}
              loading={loading}
              locationError={locationError}
              otherCitiesData={otherCitiesData}
              onCityClick={handleOtherCityClick}
              aqiData={aqiData}
              activePanel={activePanel}
              role={role}
              lang={language}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}