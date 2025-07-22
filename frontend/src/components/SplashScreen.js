import React from "react";

export default function SplashScreen() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#23242c",
      overflow: "hidden"
    }}>
      <img
        src="/logo.png" // Or your logo file
        alt="Logo"
        style={{
          width: "100vw",
          height: "100vh",
          objectFit: "contain", // Use "cover" if you want it to always fill even if cropped
          display: "block"
        }}
      />
    </div>
  );
}