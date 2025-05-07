import React from "react";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import Home from "@/pages/Home";
import ToasterProvider from "@/providers/ToasterProvider";
import Header from "@/components/layout/Header";
import AuthLoader from "@/components/AuthLoader";
import { subscribeToPush } from "@/utils/push";
import { sendManualPush } from "@/utils/sendManualPush";

const App = () => {
  const sendTestNotification = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/send", {
        method: "POST",
      });

      if (res.ok) {
        alert("✅ Testnotis skickad!");
      } else {
        alert("❌ Något gick fel när notisen skulle skickas.");
      }
    } catch (err) {
      console.error("Fel:", err);
      alert("❌ Kunde inte ansluta till servern.");
    }
  };

  const sendDelayedNotification = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sendDelayed", {
        method: "POST",
      });

      if (res.ok) {
        alert("⏳ En notis kommer om 1 minut – du kan stänga fliken nu!");
      } else {
        alert("❌ Något gick fel när notisen skulle skickas.");
      }
    } catch (err) {
      console.error("Fel:", err);
      alert("❌ Kunde inte ansluta till servern.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ToasterProvider />
      <AuthLoader />
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Home />
        <button
          onClick={subscribeToPush}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Aktivera push-notiser
        </button>

        <button
          onClick={sendTestNotification}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Skicka testnotis
        </button>

        <button
          onClick={sendDelayedNotification}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
        >
          Skicka fördröjd notis
        </button>

        <button
          onClick={sendManualPush}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Manuell push
        </button>
      </main>
      <LoginModal />
      <RegisterModal />
    </div>
  );
};

export default App;
