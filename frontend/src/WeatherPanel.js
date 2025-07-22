import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import AdvisoryPanel from "./AdvisoryPanel";

// Example icon function (customize for your weather icons)
function getWeatherIcon(main, size = 36) {
  switch (main) {
    case "Clear":
      return <span role="img" aria-label="clear" style={{ fontSize: size }}>☀️</span>;
    case "Clouds":
      return <span role="img" aria-label="clouds" style={{ fontSize: size }}>☁️</span>;
    case "Rain":
      return <span role="img" aria-label="rain" style={{ fontSize: size }}>🌧️</span>;
    case "Thunderstorm":
      return <span role="img" aria-label="thunderstorm" style={{ fontSize: size }}>⛈️</span>;
    default:
      return <span role="img" aria-label="default" style={{ fontSize: size }}>🌤️</span>;
  }
}

export default function WeatherPanel({
  weather,
  forecast,
  loading,
  locationError,
  otherCitiesData,
  onCityClick,
  aqiData,
  activePanel,
  role,
  lang // <- receive lang prop from parent (App.js)
}) {
  if (loading) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h6" color="#90caf9">Loading...</Typography>
      </Box>
    );
  }
  if (locationError) {
    return (
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h6" color="#ffb347">{locationError}</Typography>
      </Box>
    );
  }

  if (activePanel === "mainWeather") {
    return (
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 730, m: "0 auto" }}>
        {weather ? (
          <>
            <Paper sx={{ p: 3, bgcolor: "rgba(40,50,60,0.40)", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box>{getWeatherIcon(weather.main, 56)}</Box>
                <Box>
                  <Typography variant="h4" fontWeight={700} color="#90caf9">
                    {weather.city}
                  </Typography>
                  <Typography fontSize={36} fontWeight={700} color="#ffc069">
                    {weather.temp}°C
                  </Typography>
                  <Typography color="#b0c4de" fontSize={16}>
                    {weather.weatherDesc}
                  </Typography>
                  <Typography color="#b0c4de" fontSize={15} sx={{ mt: 1 }}>
                    Humidity: {weather.humidity}% | Wind: {weather.wind} m/s | Feels like: {weather.feels_like}°C
                  </Typography>
                </Box>
              </Box>
            </Paper>
            <AdvisoryPanel role={role} weather={weather} lang={lang} />
          </>
        ) : (
          <Typography color="#b0c4de" fontSize={22} mt={6} textAlign="center">
            No weather data available.
          </Typography>
        )}
      </Box>
    );
  }

  if (activePanel === "forecast") {
    return (
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 730, m: "0 auto" }}>
        <Typography variant="h5" fontWeight={700} color="#90caf9" mb={2}>
          5-Day Forecast
        </Typography>
        {forecast && forecast.length > 0 ? (
          <Grid container spacing={2}>
            {forecast.map((day, idx) => (
              <Grid item xs={6} md={2.4} key={idx}>
                <Paper sx={{ p: 2, textAlign: "center", bgcolor: "rgba(40,50,60,0.40)" }}>
                  <Typography fontWeight={700} color="#ffc069">{day.day}</Typography>
                  <Box my={1}>{getWeatherIcon(day.type, 34)}</Box>
                  <Typography fontSize={24} fontWeight={700}>{day.temp}°C</Typography>
                  <Typography color="#b0c4de" fontSize={15}>{day.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="#b0c4de" fontSize={18} mt={2}>
            No forecast data available.
          </Typography>
        )}
        <AdvisoryPanel role={role} weather={weather} lang={lang} />
      </Box>
    );
  }

  if (activePanel === "otherCities") {
    return (
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 800, m: "0 auto" }}>
        <Typography variant="h5" fontWeight={700} color="#90caf9" mb={2}>
          Other Cities
        </Typography>
        <Grid container spacing={2}>
          {otherCitiesData && otherCitiesData.length > 0 ? (
            otherCitiesData.map((city, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Paper
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    bgcolor: "rgba(40,50,60,0.40)",
                    "&:hover": { bgcolor: "rgba(144,202,249,0.20)" }
                  }}
                  onClick={() => onCityClick(city)}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {getWeatherIcon(city.weather, 34)}
                    <Box>
                      <Typography fontWeight={700} color="#ffc069" fontSize={17}>
                        {city.name}, {city.country}
                      </Typography>
                      <Typography fontSize={24} fontWeight={700}>
                        {city.temp}°C
                      </Typography>
                      <Typography color="#b0c4de" fontSize={15}>
                        {city.weatherDesc}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography color="#b0c4de" fontSize={18} mt={3}>
              No city weather data available.
            </Typography>
          )}
        </Grid>
        <AdvisoryPanel role={role} weather={weather} lang={lang} />
      </Box>
    );
  }

  if (activePanel === "aqi") {
    return (
      <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 730, m: "0 auto" }}>
        <Typography variant="h5" fontWeight={700} color="#90caf9" mb={2}>
          Air Quality Index
        </Typography>
        {aqiData ? (
          <Paper sx={{ p: 3, bgcolor: "rgba(36, 73, 111, 0.66)" }}>
            <Typography color="#ffc069" fontSize={22} fontWeight={700}>
              AQI: {aqiData.main.aqi}
            </Typography>
            <Typography color="#b0c4de" fontSize={16}>
              CO: {aqiData.components.co} μg/m³ | NO₂: {aqiData.components.no2} μg/m³
            </Typography>
            <Typography color="#b0c4de" fontSize={16}>
              PM2.5: {aqiData.components.pm2_5} μg/m³ | PM10: {aqiData.components.pm10} μg/m³
            </Typography>
          </Paper>
        ) : (
          <Typography color="#b0c4de" fontSize={18} mt={2}>
            No air quality data available.
          </Typography>
        )}
        <AdvisoryPanel role={role} weather={weather} lang={lang} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, textAlign: "center" }}>
      <Typography variant="h6" color="#90caf9">
        Select a panel from the sidebar.
      </Typography>
    </Box>
  );
}