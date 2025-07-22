import React from "react";

// Returns the correct greeting based on time and language
function getTimeGreeting(dateObj, lang = "en") {
  const hour = dateObj.getHours();
  const greetings = {
    en: ["Good morning", "Good afternoon", "Good evening"],
    es: ["Buenos días", "Buenas tardes", "Buenas noches"],
    fr: ["Bonjour", "Bon après-midi", "Bonsoir"],
    de: ["Guten Morgen", "Guten Tag", "Guten Abend"],
  };
  const g = greetings[lang] || greetings.en;
  if (hour < 12) return g[0];
  if (hour < 18) return g[1];
  return g[2];
}

function isSevereWeather(main) {
  return ["Thunderstorm", "Rain", "Snow", "Extreme"].includes(main);
}

const translations = {
  en: {
    friend: "friend",
    driver: "driver",
    farmer: "farmer",
    parent: "parent",
    alert: "Alert",
    notice: "Notice",
    weatherUpdate: "Weather update",
    noSevereDriver: "No severe weather expected for drivers. Roads should be clear.",
    noSevereFarmer: "No severe weather expected. Good conditions for farming today.",
    noSevereParent: "No severe weather expected. Children can play safely outdoors.",
    noSevereGeneral: "No severe weather expected. Have a good day!",
    closingDriver: "Drive safe!",
    closingFarmer: "Best wishes for your work!",
    closingParent: "Enjoy your day!",
    closingGeneral: "Stay safe and enjoy!",
    unavailable: "Weather data unavailable. Please try again.",
    current: "Current",
  },
  es: {
    friend: "amigo",
    driver: "conductor",
    farmer: "agricultor",
    parent: "padre",
    alert: "Alerta",
    notice: "Aviso",
    weatherUpdate: "Actualización del clima",
    noSevereDriver: "No se esperan condiciones climáticas severas para los conductores. Las carreteras deben estar despejadas.",
    noSevereFarmer: "No se esperan condiciones climáticas severas. Buenas condiciones para la agricultura hoy.",
    noSevereParent: "No se esperan condiciones severas. Los niños pueden jugar al aire libre.",
    noSevereGeneral: "No se esperan condiciones severas. ¡Que tenga un buen día!",
    closingDriver: "¡Conduce con precaución!",
    closingFarmer: "¡Éxito en tu trabajo!",
    closingParent: "¡Disfruta tu día!",
    closingGeneral: "¡Cuídate y disfruta!",
    unavailable: "Datos del clima no disponibles. Inténtelo de nuevo.",
    current: "Actual",
  },
  fr: {
    friend: "ami",
    driver: "conducteur",
    farmer: "agriculteur",
    parent: "parent",
    alert: "Alerte",
    notice: "Avis",
    weatherUpdate: "Mise à jour météo",
    noSevereDriver: "Aucune condition météorologique grave attendue pour les conducteurs. Les routes devraient être dégagées.",
    noSevereFarmer: "Aucune condition grave attendue. Bonnes conditions pour l'agriculture aujourd'hui.",
    noSevereParent: "Aucune condition grave. Les enfants peuvent jouer dehors.",
    noSevereGeneral: "Aucune condition grave. Passez une bonne journée !",
    closingDriver: "Bonne route !",
    closingFarmer: "Bonne journée de travail !",
    closingParent: "Profitez de votre journée !",
    closingGeneral: "Restez prudent et profitez-en !",
    unavailable: "Données météo indisponibles. Veuillez réessayer.",
    current: "Actuel",
  },
  de: {
    friend: "Freund",
    driver: "Fahrer",
    farmer: "Landwirt",
    parent: "Elternteil",
    alert: "Warnung",
    notice: "Hinweis",
    weatherUpdate: "Wetteraktualisierung",
    noSevereDriver: "Keine Unwetterwarnung für Fahrer. Die Straßen sollten frei sein.",
    noSevereFarmer: "Keine Unwetterwarnung. Gute Bedingungen für die Landwirtschaft heute.",
    noSevereParent: "Keine Unwetterwarnung. Kinder können sicher draußen spielen.",
    noSevereGeneral: "Keine Unwetterwarnung. Einen schönen Tag noch!",
    closingDriver: "Fahren Sie vorsichtig!",
    closingFarmer: "Viel Erfolg bei der Arbeit!",
    closingParent: "Genießen Sie den Tag!",
    closingGeneral: "Bleiben Sie sicher und genießen Sie den Tag!",
    unavailable: "Wetterdaten nicht verfügbar. Bitte versuchen Sie es erneut.",
    current: "Aktuell",
  }
};

const roleMap = {
  general: "friend",
  farmer: "farmer",
  driver: "driver",
  parent: "parent"
};

export default function AdvisoryPanel({ role = "general", weather, lang = "en" }) {
  // Always use the lang prop directly!
  const t = translations[lang] || translations.en;

  let greeting = "Hello";
  let currentTime = new Date();
  if (weather && weather.dt && weather.timezone !== undefined) {
    currentTime = new Date((weather.dt + weather.timezone) * 1000);
  }
  greeting = `${getTimeGreeting(currentTime, lang)}, ${t[roleMap[role] || "friend"]}!`;

  let content = "";
  let closing = "";

  if (weather) {
    if (isSevereWeather(weather.main)) {
      if (role === "driver") {
        content = `${t.alert}: ${weather.weatherDesc}. ${t.closingDriver}`;
        closing = t.closingDriver;
      } else if (role === "farmer") {
        content = `${t.notice}: ${weather.weatherDesc}. ${t.closingFarmer}`;
        closing = t.closingFarmer;
      } else if (role === "parent") {
        content = `${t.weatherUpdate}: ${weather.weatherDesc}. ${t.closingParent}`;
        closing = t.closingParent;
      } else {
        content = `${t.weatherUpdate}: ${weather.weatherDesc}.`;
        closing = t.closingGeneral;
      }
    } else {
      if (role === "driver") {
        content = t.noSevereDriver;
        closing = t.closingDriver;
      } else if (role === "farmer") {
        content = t.noSevereFarmer;
        closing = t.closingFarmer;
      } else if (role === "parent") {
        content = t.noSevereParent;
        closing = t.closingParent;
      } else {
        content = t.noSevereGeneral;
        closing = t.closingGeneral;
      }
    }
  } else {
    content = t.unavailable;
    closing = "";
  }

  return (
    <div style={{ background: "rgba(26, 28, 29, 0.67)", padding: 16, margin: "16px 0" }}>
      <strong style={{ color: "#ffc069" }}>{greeting}</strong>
      <div style={{ margin: "8px 0" }}>{content}</div>
      {closing && <div style={{ color: "gray" }}>{closing}</div>}
      {weather && (
        <div style={{ color: "gray", fontSize: 13 }}>
          {t.current}: {weather.weatherDesc} · {weather.temp}°C
        </div>
      )}
    </div>
  );
}