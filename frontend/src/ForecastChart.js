import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";

export default function ForecastChart({ forecast }) {
  return (
    <Box
      sx={{
        width: 340,
        height: 140,
        bgcolor: "#454753",
        borderRadius: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 2,
      }}
    >
      <Box sx={{ width: "92%", height: 70, mt: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={forecast}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#fff", fontSize: 14, fontWeight: 700 }}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(44,44,64,0.9)",
                border: "none",
                borderRadius: 8,
                color: "#fff"
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#ffc069"
              strokeWidth={4}
              dot={{ r: 6, stroke: "#fff", strokeWidth: 2, fill: "#ffc069" }}
              activeDot={{ r: 9, fill: "#fff", stroke: "#ffc069", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 1.5,
          mt: 1,
        }}
      >
        {forecast.map((item, idx) => (
          <Typography
            key={item.day + "_temp_" + idx}
            sx={{ color: "white", fontWeight: 800, fontSize: 16, minWidth: 36, textAlign: "center" }}
          >
            {item.temp}°
          </Typography>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          gap: 1.5,
          mt: 0.5,
        }}
      >
        {forecast.map((item, idx) => (
          <Typography
            key={item.day + "_label_" + idx}
            sx={{ color: "#fff", fontWeight: 600, fontSize: 13, minWidth: 36, textAlign: "center" }}
          >
            {item.day}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}