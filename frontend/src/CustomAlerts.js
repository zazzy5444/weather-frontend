import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Paper, List, ListItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const alertsText = {
  en: {
    title: "Custom Weather Alerts",
    add: "Add Alert",
    placeholder: "e.g. Alert me when it rains",
    yourAlerts: "Your Alerts",
    remove: "Remove"
  },
  es: {
    title: "Alertas Personalizadas",
    add: "Agregar Alerta",
    placeholder: "Ej: Avísame cuando llueva",
    yourAlerts: "Tus Alertas",
    remove: "Eliminar"
  },
  fr: {
    title: "Alertes Personnalisées",
    add: "Ajouter une alerte",
    placeholder: "ex: Alerte-moi quand il pleut",
    yourAlerts: "Vos alertes",
    remove: "Supprimer"
  },
  de: {
    title: "Benutzerdefinierte Wetterwarnungen",
    add: "Warnung hinzufügen",
    placeholder: "z.B. Warn mich, wenn es regnet",
    yourAlerts: "Deine Warnungen",
    remove: "Entfernen"
  }
};

function loadAlerts() {
  try {
    return JSON.parse(localStorage.getItem("weatherAlerts") || "[]");
  } catch {
    return [];
  }
}

export default function CustomAlerts({ lang = "en" }) {
  const t = alertsText[lang] || alertsText["en"];
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState("");

  useEffect(() => {
    setAlerts(loadAlerts());
  }, []);

  function addAlert() {
    if (!newAlert.trim()) return;
    const updated = [...alerts, newAlert.trim()];
    setAlerts(updated);
    localStorage.setItem("weatherAlerts", JSON.stringify(updated));
    setNewAlert("");
    // Optionally: update badge progress for "alertSetter" here!
    const badges = JSON.parse(localStorage.getItem("userBadges") || "{}");
    if (!badges.alertSetter) {
      badges.alertSetter = true;
      localStorage.setItem("userBadges", JSON.stringify(badges));
    }
  }

  function removeAlert(idx) {
    const updated = alerts.filter((_, i) => i !== idx);
    setAlerts(updated);
    localStorage.setItem("weatherAlerts", JSON.stringify(updated));
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 }, maxWidth: 600, m: "0 auto" }}>
      <Typography variant="h5" fontWeight={700} color="#90caf9" mb={2}>
        {t.title}
      </Typography>
      <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(40,50,60,0.38)" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder={t.placeholder}
            value={newAlert}
            onChange={e => setNewAlert(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#ffc069", color: "#23242c", fontWeight: 700 }}
            onClick={addAlert}
          >
            {t.add}
          </Button>
        </Box>
      </Paper>
      <Typography fontWeight={700} color="#90caf9" mb={1}>{t.yourAlerts}</Typography>
      <List>
        {alerts.length === 0 && (
          <ListItem>
            <Typography color="gray">No alerts set.</Typography>
          </ListItem>
        )}
        {alerts.map((alert, idx) => (
          <ListItem
            key={idx}
            secondaryAction={
              <IconButton edge="end" aria-label={t.remove} onClick={() => removeAlert(idx)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <Typography>{alert}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}