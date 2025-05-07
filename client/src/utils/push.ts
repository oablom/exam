export async function subscribeToPush() {
  alert("✅ Du tryckte på knappen!");
  console.log("📱 Mobil eller dator försöker aktivera push");

  if (!("serviceWorker" in navigator)) return;

  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Du måste tillåta notiser för att detta ska fungera.");
    return;
  }

  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
    });
  }
  console.log("🔁 KOPIERA DETTA: ", JSON.stringify(subscription));

  console.log("📤 Skickar prenumeration till servern:", subscription);

  const res = await fetch("http://localhost:5000/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  console.log("📬 Svar från backend:", res.status);

  alert("🔔 Push-prenumeration skickad till servern!");
}
