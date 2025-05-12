import { useEffect, useState } from "react";
import Home from "@/pages/Home";
import Header from "@/components/layout/Header";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import InstallPrompt from "@/components/InstallPrompt";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthLoader from "@/components/AuthLoader";
import { subscribeToPush } from "@/utils/push";
import { useAuth } from "@/store/auth";
import LoadingSpinner from "@/components/LoadingSpinner";

const App = () => {
  const [notificationData, setNotificationData] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { loading } = useAuth();

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const data = event.data;
      if (data?.title && data?.body) {
        setNotificationData(data);
      }
    };
    navigator.serviceWorker.addEventListener("message", listener);
    return () => {
      navigator.serviceWorker.removeEventListener("message", listener);
    };
  }, []);

  const scheduleReminder = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/scheduleReminder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    alert("⏳ Påminnelse skickas om 10 sekunder");
  };

  useEffect(() => {
    const checkSubscription = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const reg = await navigator.serviceWorker.ready;
        const sub = await reg.pushManager.getSubscription();
        setIsSubscribed(!!sub);
      }
    };
    checkSubscription();
  }, []);

  return (
    <>
      <AuthLoader />
      {loading ? (
        <LoadingSpinner fullPage message="Ansluter till server..." />
      ) : (
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <ToasterProvider />
          <Header />

          <main className="flex-grow flex flex-col gap-4 items-center justify-center">
            <Home />
            {!isSubscribed && (
              <button
                onClick={subscribeToPush}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Aktivera push-notiser
              </button>
            )}

            <button
              onClick={scheduleReminder}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Visa modal efter 10 sek
            </button>
            <InstallPrompt />
          </main>

          {notificationData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-md max-w-sm">
                <h2 className="text-xl font-semibold mb-2">
                  {notificationData.title}
                </h2>
                <p className="mb-4">{notificationData.body}</p>
                <button
                  onClick={() => setNotificationData(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Stäng
                </button>
              </div>
            </div>
          )}

          <LoginModal />
          <RegisterModal />
        </div>
      )}
    </>
  );
};

export default App;
