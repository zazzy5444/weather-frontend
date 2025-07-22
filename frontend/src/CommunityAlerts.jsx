import React, { useState } from "react";

const uiText = {
  en: {
    title: "Community Alerts",
    share: "Share a weather update for your area (hazards, flooding, power outages, etc.):",
    placeholder: "Type your alert here...",
    post: "Post",
    recent: "Recent Alerts",
    noAlerts: "No community alerts yet.",
  },
  es: {
    title: "Alertas Comunitarias",
    share: "Comparte una actualización climática para tu zona (peligros, inundaciones, cortes de energía, etc.):",
    placeholder: "Escribe tu alerta aquí...",
    post: "Publicar",
    recent: "Alertas Recientes",
    noAlerts: "Aún no hay alertas comunitarias.",
  },
  fr: {
    title: "Alertes Communautaires",
    share: "Partagez une mise à jour météo pour votre région (dangers, inondations, pannes de courant, etc.):",
    placeholder: "Saisissez votre alerte ici...",
    post: "Publier",
    recent: "Alertes Récentes",
    noAlerts: "Aucune alerte communautaire pour le moment.",
  },
  de: {
    title: "Gemeinschaftswarnungen",
    share: "Teilen Sie eine Wettermeldung für Ihre Region (Gefahren, Überschwemmungen, Stromausfälle usw.):",
    placeholder: "Geben Sie hier Ihre Warnung ein...",
    post: "Senden",
    recent: "Aktuelle Warnungen",
    noAlerts: "Noch keine Gemeinschaftswarnungen.",
  }
};

export default function CommunityAlerts({ city, lang = "en" }) {
  const t = uiText[lang] || uiText.en;
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState("");

  const submitAlert = () => {
    if (!newAlert.trim()) return;
    setAlerts([
      {
        id: Date.now(),
        user: "You",
        message: newAlert,
        location: city || "Current Location",
        timestamp: new Date().toLocaleString(),
        lang // Store the language used for this alert
      },
      ...alerts,
    ]);
    setNewAlert("");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2 style={{ color: "#90caf9" }}>{t.title}</h2>
      <div style={{ background: "rgba(40,50,60,0.40)", padding: 16, marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>{t.share}</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="text"
            placeholder={t.placeholder}
            value={newAlert}
            onChange={e => setNewAlert(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={submitAlert} style={{ background: "#90caf9", color: "#222", fontWeight: 700 }}>
            {t.post}
          </button>
        </div>
      </div>
      <div style={{ color: "#90caf9", fontWeight: 700, marginBottom: 8 }}>{t.recent}</div>
      <div style={{ background: "rgba(30, 35, 40, 0.58)", maxHeight: 320, overflowY: "auto" }}>
        {alerts.length === 0 && (
          <div style={{ padding: 8 }}>{t.noAlerts}</div>
        )}
        {alerts.map(alert => (
          <div key={alert.id} style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
            <div>
              <b>{alert.user}</b> ({alert.location}) <span style={{ color: "#b0c4de", fontSize: 12 }}>{alert.timestamp}</span>
            </div>
            <div>{alert.message}</div>
          </div>
        ))}
      </div>
    </div>
  );
}