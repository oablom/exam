self.addEventListener("push", (event) => {
  console.log("📩 Push mottagen i service worker");

  let payloadText = "[❌ Ingen data mottagen]";
  try {
    if (event.data) {
      const data = event.data.text();
      payloadText = data;
      console.log("📦 Rå push-data:", data);
    } else {
      console.warn("⚠️ event.data saknas");
    }
  } catch (err) {
    console.error("❌ Kunde inte läsa push-data", err);
  }

  self.registration.showNotification("🔔 Push mottagen!", {
    body: payloadText,
    icon: "/vite.svg",
  });
});
