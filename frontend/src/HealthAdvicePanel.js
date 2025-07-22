import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { OPEN_WEATHER_API_KEY } from "./config";

// AQI levels with keys (colors still local, text via i18n)
const AQI_LEVELS = [
  { key: "good", color: "#4caf50" },
  { key: "fair", color: "#cddc39" },
  { key: "moderate", color: "#ffeb3b" },
  { key: "poor", color: "#ff9800" },
  { key: "veryPoor", color: "#f44336" }
];

function getActivityAdviceKey(temp, wind, rain, aqi) {
  if (aqi >= 4) return "aqi.activity.poor";
  if (temp >= 35) return "aqi.activity.hot";
  if (temp <= 5) return "aqi.activity.cold";
  if (wind >= 10) return "aqi.activity.windy";
  if (rain >= 0.5) return "aqi.activity.rainy";
  return "aqi.activity.great";
}

export default function HealthAdvicePanel({ lat, lon, weather }) {
  const { t } = useTranslation();
  const [aqData, setAqData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lon) return;
    setLoading(true);
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setAqData(data.list && data.list[0]);
        setLoading(false);
      });
  }, [lat, lon]);

  if (!lat || !lon) return null;
  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <CircularProgress />
    </Box>
  );
  if (!aqData) return (
    <Typography color="error" sx={{ mt: 2 }}>
      {t("aqi.no_data")}
    </Typography>
  );

  const aqi = aqData.main.aqi || 1; // 1-5
  const level = AQI_LEVELS[aqi - 1];
  const temp = weather?.temp ?? 20;
  const wind = weather?.wind_speed ?? 2;
  const rain = weather?.rain ?? 0;

  return (
    <Paper sx={{ p: 2, mt: 3, background: "#232332" }}>
      <Typography variant="h6" gutterBottom>
        {t("aqi.insights")}
      </Typography>
      <Typography>
        <b>{t("aqi.label")}</b>{" "}
        <span style={{ color: level.color }}>
          {aqi} ({t(`aqi.levels.${level.key}.label`)})
        </span>
      </Typography>
      <Typography fontWeight={600} sx={{ color: level.color }}>
        {t(`aqi.levels.${level.key}.advice`)}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight={700}>{t("aqi.outdoor_advice")}</Typography>
        <Typography>{t(getActivityAdviceKey(temp, wind, rain, aqi))}</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight={700}>{t("aqi.pollutants")}</Typography>
        <Typography>PM2.5: {aqData.components.pm2_5}</Typography>
        <Typography>PM10: {aqData.components.pm10}</Typography>
        <Typography>O₃ (Ozone): {aqData.components.o3}</Typography>
        <Typography>NO₂: {aqData.components.no2}</Typography>
        <Typography>SO₂: {aqData.components.so2}</Typography>
        <Typography>CO: {aqData.components.co}</Typography>
      </Box>
      <Typography sx={{ mt: 2, fontSize: 14, color: "#b0bec5" }}>
        {t("aqi.sensitive_groups")}
      </Typography>
    </Paper>
  );
}