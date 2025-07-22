import React from "react";
import { Box, Typography } from "@mui/material";

export default function RadarMap({ lat, lon }) {
  const url =
    lat && lon
      ? `https://tile.openweathermap.org/map/precipitation_new/10/${Math.floor(
          lon
        )},${Math.floor(lat)}.png?appid=055a36d0e28104f0c280cbcab0c784e4`
      : "";

  return (
    <Box
      sx={{
        mt: 3,
        width: 290,
        height: 160,
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#181a22",
      }}
      aria-label="Weather Radar Map"
      tabIndex={0}
    >
      <Typography color="#fff" fontSize={14} mb={1}>
        Precipitation Radar
      </Typography>
      {url ? (
        <img
          src={url}
          alt="Radar Precipitation Overlay"
          width={280}
          height={140}
          style={{ objectFit: "cover" }}
          onError={e => { e.target.style.display = "none"; }}
        />
      ) : (
        <Typography color="#fff" fontSize={12}>
          Map not available
        </Typography>
      )}
    </Box>
  );
}