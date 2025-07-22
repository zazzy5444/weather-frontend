import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const AQI_LEVELS = [
  { label: "Good", color: "#4caf50", advice: "airAdviceGood" },
  { label: "Fair", color: "#cddc39", advice: "airAdviceFair" },
  { label: "Moderate", color: "#ffeb3b", advice: "airAdviceModerate" },
  { label: "Poor", color: "#ff9800", advice: "airAdvicePoor" },
  { label: "Very Poor", color: "#f44336", advice: "airAdviceVeryPoor" }
];

export default function AirQualityPanel({ aqiData }) {
  const { t } = useTranslation();
  if (!aqiData) return null;
  const aqi = aqiData.main?.aqi || 1;
  const aqiInfo = AQI_LEVELS[aqi - 1];
  return (
    <Paper sx={{
      p: 2,
      mt: 3,
      background: "rgba(34,36,44,0.40)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: 4,
    }}>
      <Typography variant="h6" gutterBottom>
        {t("airQualityIndex")} <span style={{ color: aqiInfo.color }}>{aqi} ({t(aqiInfo.label)})</span>
      </Typography>
      <Typography variant="body1" sx={{ color: aqiInfo.color, fontWeight: 600 }}>
        {t(aqiInfo.advice)}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight={700}>{t("mainPollutants")}</Typography>
        <Typography>PM2.5: {aqiData.components?.pm2_5}</Typography>
        <Typography>PM10: {aqiData.components?.pm10}</Typography>
        <Typography>O₃ (Ozone): {aqiData.components?.o3}</Typography>
        <Typography>NO₂: {aqiData.components?.no2}</Typography>
        <Typography>SO₂: {aqiData.components?.so2}</Typography>
        <Typography>CO: {aqiData.components?.co}</Typography>
      </Box>
      <Typography sx={{ mt: 2, fontSize: 14, color: "#b0bec5" }}>
        {t("sensitiveGroups")}
      </Typography>
    </Paper>
  );
}