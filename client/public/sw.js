self.addEventListener("push", (event) => {
  console.log("📩 PUSH mottagen i service worker");

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
      url: "/", // öppna startsidan vid klick
    },
  };

  event.waitUntil(
    (async () => {
      // 🔔 Visa systemnotis (alltid!)
      await self.registration.showNotification(data.title, options);

      // 💬 Skicka till öppen flik (om den finns – så modal visas)
      const clientsList = await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });

      for (const client of clientsList) {
        client.postMessage(data); // Frontend visar modal
      }
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
