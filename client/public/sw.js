self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "Påminnelse!",
    body: "Dags att göra något!",
  };

  const options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
  };

  event.waitUntil(
    (async () => {
      // Visa alltid notis
      await self.registration.showNotification(data.title, options);

      // Skicka till öppen flik (om den finns)
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
