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
    <div className="fixed top-4 right-6 p-4 bg-blue-600 text-white rounded-xl shadow-xl z-50">
      <button onClick={handleInstallClick}>📲 Installera appen</button>
    </div>
  );
};

export default InstallPrompt;
