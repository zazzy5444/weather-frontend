import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  Button,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ErrorIcon from "@mui/icons-material/Error";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import GrainIcon from "@mui/icons-material/Grain";
import RoleSelector from "./RoleSelector";

function getWeatherIcon(main, size = 24) {
  switch (main) {
    case "Clear":
      return <WbSunnyIcon sx={{ fontSize: size, color: "#ffd700" }} />;
    case "Clouds":
      return <CloudIcon sx={{ fontSize: size, color: "#b0c4de" }} />;
    case "Rain":
      return <GrainIcon sx={{ fontSize: size, color: "#90caf9" }} />;
    case "Thunderstorm":
      return <ThunderstormIcon sx={{ fontSize: size, color: "#607d8b" }} />;
    default:
      return <CloudIcon sx={{ fontSize: size, color: "#b0c4de" }} />;
  }
}

// Translation object for sidebar-specific UI
const sidebarText = {
  en: {
    searchPlaceholder: "Search for a city...",
    search: "Search",
    recentSearches: "Recent Searches",
    humidity: "Humidity",
    wind: "Wind",
    weather: "Weather",
    detectingLocation: "Detecting your location...",
    tryAgain: "Try again",
    selectArea: "Your Area",
    otherCities: "Other Cities",
    forecast: "Forecast",
    communityAlerts: "Community Alerts"
  },
  es: {
    searchPlaceholder: "Buscar una ciudad...",
    search: "Buscar",
    recentSearches: "Búsquedas recientes",
    humidity: "Humedad",
    wind: "Viento",
    weather: "Clima",
    detectingLocation: "Detectando tu ubicación...",
    tryAgain: "Intentar de nuevo",
    selectArea: "Tu zona",
    otherCities: "Otras ciudades",
    forecast: "Pronóstico",
    communityAlerts: "Alertas Comunitarias"
  },
  fr: {
    searchPlaceholder: "Rechercher une ville...",
    search: "Rechercher",
    recentSearches: "Recherches récentes",
    humidity: "Humidité",
    wind: "Vent",
    weather: "Météo",
    detectingLocation: "Détection de votre position...",
    tryAgain: "Réessayer",
    selectArea: "Votre zone",
    otherCities: "Autres villes",
    forecast: "Prévisions",
    communityAlerts: "Alertes Communautaires"
  },
  de: {
    searchPlaceholder: "Stadt suchen...",
    search: "Suchen",
    recentSearches: "Letzte Suchen",
    humidity: "Luftfeuchtigkeit",
    wind: "Wind",
    weather: "Wetter",
    detectingLocation: "Standort wird ermittelt...",
    tryAgain: "Erneut versuchen",
    selectArea: "Ihr Gebiet",
    otherCities: "Andere Städte",
    forecast: "Vorhersage",
    communityAlerts: "Gemeinschaftswarnungen"
  }
};

export default function Sidebar({
  search,
  setSearch,
  handleSearch,
  loading,
  recent = [],
  weather,
  locationError,
  getWeatherForGeolocation,
  onPanelSelect,
  role,
  setRole,
  lang = "en"
}) {
  const t = sidebarText[lang] || sidebarText.en;

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <Box
      sx={{
        width: { xs: "100vw", sm: 300, md: 340 },
        minWidth: { xs: "unset", sm: 0, md: 340 },
        bgcolor: "rgba(40,44,52,0.8)",
        p: { xs: 2, sm: 3 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: { xs: 0, sm: 7 },
        boxShadow: 8,
        height: { xs: "auto", md: "100%" },
        minHeight: 520,
        position: { xs: "static", md: "relative" },
        zIndex: 2,
      }}
    >
      <Box>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
          <TextField
            variant="outlined"
            placeholder={t.searchPlaceholder}
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
            sx={{
              bgcolor: "rgba(255,255,255,0.10)",
              borderRadius: 3,
              input: { color: "#fff" },
              flex: 1
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#ccc" }} />
                </InputAdornment>
              ),
              sx: { color: "#fff" }
            }}
            disabled={loading}
          />
          <Button
            onClick={handleSearch}
            sx={{
              ml: 1,
              minWidth: 0,
              height: 40,
              bgcolor: "#ffc069",
              color: "#222",
              borderRadius: 2,
              fontWeight: "bold",
              boxShadow: 2,
              "&:hover": { bgcolor: "#ffb347" }
            }}
            variant="contained"
            disabled={loading}
          >
            {t.search}
          </Button>
        </Box>

        <Divider sx={{ bgcolor: "#444", my: 1.5 }} />
        <Typography color="gray" fontSize={14} gutterBottom>
          {t.recentSearches}
        </Typography>
        <Box>
          {(recent || []).map((item, idx) => (
            <Paper
              key={item.city + idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255,255,255,0.07)",
                p: 1,
                mb: 1,
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              {getWeatherIcon(item.main)}
              <Typography color="white" fontWeight="bold" fontSize={15}>
                {item.city}
              </Typography>
              <Typography color="#ffc069" fontWeight="bold" fontSize={15} sx={{ ml: "auto" }}>
                {item.temp}°
              </Typography>
            </Paper>
          ))}
        </Box>
        {weather && (
          <Box sx={{ mt: 2, bgcolor: "rgba(255,255,255,0.07)", borderRadius: 3, p: 2 }}>
            <Typography fontWeight="bold" color="#ffc069" fontSize={17}>
              {getWeatherIcon(weather.main, 24)} {weather.city}
            </Typography>
            <Typography color="white" fontSize={26} fontWeight={700}>
              {weather.temp}°
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Typography color="#b0c4de" fontSize={14}>
                {t.humidity}: {weather.humidity}%
              </Typography>
              <Typography color="#b0c4de" fontSize={14}>
                {t.wind}: {weather.wind} m/s
              </Typography>
            </Box>
            <Typography color="gray" fontSize={14} mt={1}>
              {t.weather}: {weather.main}
            </Typography>
          </Box>
        )}

        {/* Role Selector Section */}
        <RoleSelector role={role} setRole={setRole} lang={lang} />

        {/* Community Alerts Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#90caf9",
            color: "#222",
            fontWeight: 700,
            my: 1,
            "&:hover": { bgcolor: "#64b5f6" }
          }}
          onClick={() => onPanelSelect("communityAlerts")}
        >
          {t.communityAlerts}
        </Button>
      </Box>
      <Box>
        <Typography color="gray" fontSize={13} gutterBottom>
          {t.selectArea}
        </Typography>
        <Box
          sx={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
            overflow: "hidden",
            boxShadow: 2,
            border: "2px solid #ffb347"
          }}
        >
          <Avatar
            variant="circular"
            src="https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg"
            sx={{ width: 70, height: 70, opacity: 0.7 }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <LocationOnIcon color="primary" fontSize="small" />
          <Typography color="white" sx={{ ml: 1, fontSize: 14 }}>
            {loading && t.detectingLocation}
            {locationError && (
              <>
                <span style={{ color: "#ffc069" }}>
                  <ErrorIcon sx={{ fontSize: 16, mr: 0.5, mb: -0.5 }} /> {locationError}
                </span>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ ml: 1, borderColor: "#ffc069", color: "#ffc069", fontSize: 11, py: 0.2, px: 1, minWidth: 0 }}
                  onClick={getWeatherForGeolocation}
                >
                  {t.tryAgain}
                </Button>
              </>
            )}
            {!loading && !locationError && weather && (
              <>
                {weather.city}
                <span style={{ marginLeft: 8, fontWeight: 700, color: "#ffc069" }}>
                  {getWeatherIcon(weather.main, 20)} {weather.temp}°
                </span>
                <span style={{ marginLeft: 8, color: "#b0c4de", fontSize: 13 }}>
                  {t.humidity}: {weather.humidity}% | {t.wind}: {weather.wind} m/s
                </span>
              </>
            )}
          </Typography>
        </Box>
        <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="outlined"
            fullWidth
            sx={{ color: "#ffc069", borderColor: "#ffc069", fontWeight: 700 }}
            onClick={() => onPanelSelect("otherCities")}
          >
            {t.otherCities}
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{ color: "#ffc069", borderColor: "#ffc069", fontWeight: 700 }}
            onClick={() => onPanelSelect("forecast")}
          >
            {t.forecast}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}