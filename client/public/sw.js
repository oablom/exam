self.addEventListener("push", (event) => {
  console.log("PUSH mottagen i service worker");

  let data = {
    title: "Påminnelse!",
    body: "Det är dags att göra något!",
  };

  try {
    if (event.data) {
      data = event.data.json();
      console.log(" Push-data:", data);
    }
  } catch (err) {
    console.error("Kunde inte tolka push-data", err);
  }

  const options = {
    body: data.body,
    icon: "/zenbuddy.png",
    badge: "/zenbuddy.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
    data: {
      url: "/",
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

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
