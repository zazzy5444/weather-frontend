import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import WbCloudyIcon from "@mui/icons-material/WbCloudy";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";

const searches = [
  {
    city: "Liverpool, UK",
    temp: 16,
    condition: "Partly Cloudy",
    icon: <WbCloudyIcon sx={{ fontSize: 38, color: "#b0c4de" }} />
  },
  {
    city: "Palermo, Italy",
    temp: -2,
    condition: "Rain/Thunder",
    icon: <ThunderstormIcon sx={{ fontSize: 38, color: "#ffc069" }} />
  }
];

export default function RecentSearches() {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography color="white" fontWeight="bold" fontSize={18}>
          Recently Searched
        </Typography>
        <Typography color="primary" fontSize={14} sx={{ cursor: "pointer" }}>
          See All &rarr;
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {searches.map((s, i) => (
          <Grid item xs={6} key={i}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "rgba(255,255,255,0.08)",
                borderRadius: 3,
                boxShadow: 2
              }}
            >
              {s.icon}
              <Box>
                <Typography color="white" fontWeight="bold" fontSize={22}>
                  {s.temp}°
                </Typography>
                <Typography color="gray" fontSize={12}>
                  {s.condition}
                </Typography>
                <Typography color="white" fontSize={13}>
                  {s.city}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}