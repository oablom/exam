import axios from "axios";
import { urlBase64ToUint8Array } from "@/utils/urlBase64ToUint8Array";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const subscribeToPush = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("❌ Push-notiser stöds inte i denna webbläsare");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  // 🧨 Ta bort gammal prenumeration (om den finns)
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    await existingSubscription.unsubscribe();
    console.log("♻️ Tidigare prenumeration togs bort");
  }

  // 🆕 Skapa ny
  const newSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  // ☁️ Skicka till backend
  await axios.post(
    `${import.meta.env.VITE_API_URL}/api/subscribe`,
    newSubscription
  );

  console.log("✅ Ny push-prenumeration skapad");
  return newSubscription;
};
