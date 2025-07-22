import React from "react";
import { Box, Typography } from "@mui/material";


export default function HeroHeader({ city, date, temperature, icon }) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        py: 3,
        px: 4,
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.03)",
        mb: 3,
        boxShadow: 1
      }}
    >
      {icon}
      <Box>
        <Typography variant="h4" color="white" fontWeight={700}>
          {city}
        </Typography>
        <Typography color="gray" fontSize={18}>
          {date}
        </Typography>
        {temperature && (
          <Typography color="#ffc069" variant="h3" fontWeight={700}>
            {temperature}
          </Typography>
        )}
      </Box>
    </Box>
  );
}