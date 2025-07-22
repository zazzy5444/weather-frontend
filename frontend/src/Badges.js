import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const badgesText = {
  en: { title: "Your Badges", earned: "Earned", notYet: "Not yet earned", desc: {
    reporter: "Submitted your first weather report",
    explorer: "Viewed weather in 5 different cities",
    alertSetter: "Created a custom weather alert",
    community: "Posted in Community Alerts",
    streak: "Checked the weather 5 days in a row"
  }},
  es: { title: "Tus Insignias", earned: "Obtenida", notYet: "Aún no obtenida", desc: {
    reporter: "Enviaste tu primer reporte meteorológico",
    explorer: "Consultaste el clima en 5 ciudades",
    alertSetter: "Creaste una alerta personalizada",
    community: "Publicaste en Alertas Comunitarias",
    streak: "Consultaste el clima 5 días seguidos"
  }},
  fr: { title: "Vos Badges", earned: "Obtenu", notYet: "Pas encore obtenu", desc: {
    reporter: "Premier rapport météo soumis",
    explorer: "A consulté la météo dans 5 villes",
    alertSetter: "A créé une alerte météo personnalisée",
    community: "A posté dans Alertes Communautaires",
    streak: "A consulté la météo 5 jours d'affilée"
  }},
  de: { title: "Deine Abzeichen", earned: "Erhalten", notYet: "Noch nicht erhalten", desc: {
    reporter: "Ersten Wetterbericht eingesendet",
    explorer: "Wetter in 5 Städten angesehen",
    alertSetter: "Benutzerdefinierte Wetterwarnung erstellt",
    community: "In Gemeinschaftswarnungen gepostet",
    streak: "Wetter an 5 Tagen in Folge geprüft"
  }}
};

const BADGE_KEYS = [
  "reporter",
  "explorer",
  "alertSetter",
  "community",
  "streak"
];

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem("userBadges") || "{}");
  } catch {
    return {};
  }
}

export default function Badges({ lang = "en" }) {
  const t = badgesText[lang] || badgesText["en"];
  const [progress, setProgress] = useState({});

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 700, m: "0 auto" }}>
      <Typography variant="h5" fontWeight={700} color="#90caf9" mb={2}>
        {t.title}
      </Typography>
      <Grid container spacing={2}>
        {BADGE_KEYS.map(key => (
          <Grid item xs={12} sm={6} key={key}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: progress[key] ? "rgba(144,202,249,0.18)" : "rgba(255,255,255,0.07)"
              }}
            >
              <Box sx={{
                width: 42, height: 42, borderRadius: "50%",
                bgcolor: progress[key] ? "#ffc069" : "#b0c4de",
                color: "#23242c", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {progress[key] ? "🏅" : "🔒"}
              </Box>
              <Box>
                <Typography fontWeight={700}>{t.desc[key]}</Typography>
                <Typography fontSize={13} color={progress[key] ? "#ffc069" : "gray"}>
                  {progress[key] ? t.earned : t.notYet}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}