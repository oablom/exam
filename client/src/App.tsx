import React, { useEffect, useState } from "react";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import Home from "@/pages/Home";
import ToasterProvider from "@/providers/ToasterProvider";
import Header from "@/components/layout/Header";
import AuthLoader from "@/components/AuthLoader";
import { subscribeToPush } from "@/utils/push";

const USER_ID = "abc123"; // ← ändra om du vill använda riktig auth senare

const App = () => {
  const [notificationData, setNotificationData] = useState<{
    title: string;
    body: string;
  } | null>(null);

  const scheduleReminder = async () => {
    await fetch("http://localhost:5000/api/scheduleReminder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID }),
    });

    alert("⏳ Påminnelse lagd – modalen visas om 10 sekunder!");
  };

  // Polla backend var 5:e sekund
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`http://localhost:5000/api/reminders/${USER_ID}`);
      const data = await res.json();
      if (data.trigger) {
        setNotificationData({
          title: "⏰ Påminnelse!",
          body: "Det har gått 10 sekunder – dags att göra något!",
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ToasterProvider />
      <AuthLoader />
      <Header />

      <main className="flex-grow flex flex-col gap-4 items-center justify-center">
        <Home />

        <button
          onClick={subscribeToPush}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Aktivera push-notiser
        </button>

        <button
          onClick={scheduleReminder}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Visa modal efter 1 minut
        </button>
      </main>

      {/* Modal som visas när backend säger till */}
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
          <div>
            <button
              onClick={() => alert("Button clicked!")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              AAlert test
            </button>
          </div>
        </div>
      )}

      <LoginModal />
      <RegisterModal />
    </div>
  );
};

export default App;
