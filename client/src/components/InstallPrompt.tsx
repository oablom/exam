import { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      console.log("✅ Appen installerades");
    } else {
      console.log("❌ Användaren nekade installation");
    }

    setDeferredPrompt(null);
    setShowButton(false);
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-blue-600 text-white rounded-xl shadow-xl z-50">
      <button
        onClick={handleInstallClick}
        className="px-4 py-2 bg-green-500 rounded hover:bg-green-600"
      >
        📲 Installera appen
      </button>
    </div>
  );
};

export default InstallPrompt;
