self.addEventListener("push", (event) => {
  console.log("📩 Push mottagen i service worker");

  let data = { title: "Push", body: "Default" };
  try {
    if (event.data) {
      data = event.data.json();
      console.log("📦 Rå push-data:", data);
    }
  } catch (err) {
    console.error("❌ Kunde inte parsa push-data", err);
  }

  // 🔔 Visa systemnotis
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/vite.svg",
  });

  // 📬 Skicka data till öppna flikar
  self.clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      console.log("🧪 Flikar hittade:", clients.length);
      clients.forEach((client) => {
        console.log("📤 Skickar message till client:", client.url);
        client.postMessage(data);
      });
    });
});
