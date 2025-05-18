import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "@/pages/Home";
import FocusPage from "@/pages/FocusPage";
import Header from "@/components/layout/header/Header";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import InstallPrompt from "@/components/InstallPrompt";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthLoader from "@/components/AuthLoader";

import BackendStatus from "./system/BackendStatus";

useEffect(() => {
  document.documentElement.classList.remove("dark");
}, []);

const App = () => {
  return (
    <>
      <BackendStatus message="Connecting to server..." />
      <AuthLoader />
      <BrowserRouter>
        <ToasterProvider />
        <Header />

        <main className="flex-grow flex flex-col gap-4 items-center justify-center mt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/focus" element={<FocusPage />} />
          </Routes>
          <InstallPrompt />
        </main>

        <LoginModal />
        <RegisterModal />
      </BrowserRouter>
    </>
  );
};

export default App;
