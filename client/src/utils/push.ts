import axios from "axios";
import { urlBase64ToUint8Array } from "./urlBase64ToUint8Array";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

export const subscribeToPush = async (): Promise<PushSubscription | null> => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push-notiser stöds inte i denna webbläsare");
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.ready;

    const existing = await reg.pushManager.getSubscription();
    const sub =
      existing ??
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      }));

    await axios.post(`${API_URL}/api/subscribe`, sub, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    console.log("✅ Push-prenumeration skickad till backend");
    return sub;
  } catch (err) {
    console.error("❌ Kunde inte skapa/skicka push-prenumeration", err);
    return null;
  }
};
