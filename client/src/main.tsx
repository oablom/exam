import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((reg) => {
      console.log("✅ SW registrerad", reg);
      if (!navigator.serviceWorker.controller) {
        console.warn("⚠️ Fliken är inte kontrollerad av SW – ladda om!");
      } else {
        console.log("🎮 Fliken är kontrollerad av SW");
      }
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
