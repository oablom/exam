self.addEventListener("push", (event) => {
  console.log("📩 Push mottagen i service worker");

  // Standardvärden om inget skickas
  let data = {
    title: "Påminnelse!",
    body: "Det är dags att göra något!",
  };

  try {
    if (event.data) {
      data = event.data.json();
      console.log("📦 Push-data:", data);
    }
  } catch (err) {
    console.error("❌ Kunde inte tolka push-data", err);
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: {
      url: data.url || "/", // används om du vill öppna specifik sida
    },
  };

  event.waitUntil(
    (async () => {
      // 🔔 Visa notisen – fungerar även om appen är stängd
      await self.registration.showNotification(data.title, options);

      // 💬 Skicka meddelande till öppen flik (om den finns)
      const clientsList = await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });

      for (const client of clientsList) {
        client.postMessage(data); // t.ex. visa modal i frontend
      }
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 🚪 Öppna appen vid klick på notisen
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
