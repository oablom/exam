self.addEventListener("push", (event) => {
  console.log("📩 Push mottagen i service worker");

  let data = {
    title: "Påminnelse!",
    body: "Det är dags att göra något!",
  };

  try {
    if (event.data) {
      data = event.data.json();
      console.log("📦 Rå push-data:", data);
    }
  } catch (err) {
    console.error("❌ Kunde inte parsa push-data", err);
  }

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(data.title, options);

      const clientsList = await self.clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });

      for (const client of clientsList) {
        client.postMessage(data);
      }
    })()
  );
});
