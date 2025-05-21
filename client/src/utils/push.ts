import axios from "axios";
import { urlBase64ToUint8Array } from "@/utils/urlBase64ToUint8Array";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const subscribeToPush = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push-notiser stöds inte i denna webbläsare");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  try {
    const existingSubscription =
      await registration.pushManager.getSubscription();
    if (existingSubscription) {
      await existingSubscription.unsubscribe();
      console.log(" Tidigare prenumeration togs bort");
    }

    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/subscribe`,
      newSubscription,
      { withCredentials: true }
    );

    console.log(" Ny push-prenumeration skapad");
    return newSubscription;
  } catch (err) {
    console.error(" Fel vid prenumeration:", err);
  }
};
