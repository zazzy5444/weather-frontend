import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function Weather({ city, weather }) {
  if (!weather) return null;

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{city}</Typography>
        <Typography variant="body1">
          {weather.weather[0].description}
        </Typography>
        <Typography variant="h6">
          Temperature: {weather.main.temp}°C
        </Typography>
        <Typography>
          Humidity: {weather.main.humidity}%
        </Typography>
        <Typography>
          Wind: {weather.wind.speed} m/s
        </Typography>
      </CardContent>
    </Card>
  );
}
export default Weather;