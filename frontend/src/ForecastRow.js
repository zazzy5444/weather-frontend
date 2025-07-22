import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import GrainIcon from "@mui/icons-material/Grain";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { useTranslation } from "react-i18next";

function getIcon(type) {
  switch (type) {
    case "Clear": return <WbSunnyIcon sx={{ color: "#ffd700", fontSize: 38 }} />;
    case "Clouds": return <CloudIcon sx={{ color: "#90a4ae", fontSize: 38 }} />;
    case "Rain": return <GrainIcon sx={{ color: "#2196f3", fontSize: 38 }} />;
    case "Snow": return <AcUnitIcon sx={{ color: "#81d4fa", fontSize: 38 }} />;
    default: return <CloudIcon sx={{ color: "#b0bec5", fontSize: 38 }} />;
  }
}

export default function ForecastRow({ forecast }) {
  const { t } = useTranslation();

  if (!forecast || forecast.length === 0) return null;
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        overflowX: "auto",
        p: 2,
        mt: 2,
        width: "100%",
      }}
      aria-label={t("fiveDayForecast")}
      tabIndex={0}
    >
      {forecast.map((item, idx) => (
        <Paper
          key={item.day + "_" + idx}
          elevation={4}
          sx={{
            minWidth: 96,
            maxWidth: 110,
            height: 140,
            flex: "0 0 auto",
            bgcolor: "rgba(34,36,44,0.8)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0 4px 24px #0003",
            },
            backdropFilter: "blur(2px)",
          }}
        >
          <Typography variant="subtitle1" color="textSecondary" fontWeight={600}>
            {item.day}
          </Typography>
          <Box mt={1}>{getIcon(item.type)}</Box>
          <Typography
            variant="h5"
            fontWeight={700}
            color={item.temp >= 30 ? "#ff9800" : item.temp <= 15 ? "#2196f3" : "#fff"}
            mt={1}
          >
            {item.temp}°
          </Typography>
          {item.description && (
            <Typography
              variant="caption"
              color="#b0bec5"
              fontWeight={500}
              mt={0.5}
              textAlign="center"
              sx={{ fontSize: 11 }}
            >
              {item.description}
            </Typography>
          )}
        </Paper>
      ))}
    </Box>
  );
}