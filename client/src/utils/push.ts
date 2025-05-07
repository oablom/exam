export async function subscribeToPush() {
  alert("🔔 Startar test för push...");

  if (!("serviceWorker" in navigator)) {
    alert("❌ Service workers stöds inte");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  alert("📛 Tillstånd: " + permission);

  if (permission !== "granted") {
    alert("❌ Du måste tillåta notiser");
    return;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
  });

  alert("✅ Prenumeration skapad");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  alert("📬 Server-svar: " + res.status);
}
