self.addEventListener("push", (event) => {
  console.log("📩 PUSH mottagen");

  const data = event.data?.json() || {};
  const title = data.title || "Testnotis";
  const options = {
    body: data.body || "Funkar det här?",
    // icon: undefined, // tillfälligt! Testa utan ikon
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
