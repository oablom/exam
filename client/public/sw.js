self.addEventListener("push", (event) => {
  console.log("📩 Push mottagen i service worker");

  let data = { title: "Påminnelse!", body: "Det är dags att göra något!" };

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
    icon: "/vite.svg",
    badge: "/vite.svg",
    vibrate: [200, 100, 200], // 📳 vibrerar
    requireInteraction: true, // 🔔 kräver att användaren klickar bort
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  self.registration.showNotification(data.title, options);

  self.clients
    .matchAll({ includeUncontrolled: true, type: "window" })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage(data);
      });
    });
});

self.addEventListener("push", (event) => {
  const data = event.data?.json();
  const title = data?.title || "Notis";
  const options = {
    body: data?.body || "Du har en ny påminnelse!",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
