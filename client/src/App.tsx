import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import FocusPage from "@/pages/FocusPage";
import Header from "@/components/layout/Header";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import InstallPrompt from "@/components/InstallPrompt";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthLoader from "@/components/AuthLoader";
import { useAuth } from "@/store/auth";
import LoadingSpinner from "@/components/LoadingSpinner";
import PingBackend from "./system/PingBackend";

const App = () => {
  const { loading } = useAuth();

  return (
    <>
      <PingBackend />
      <AuthLoader />
      {loading ? (
        <LoadingSpinner fullPage message="Ansluter till server..." />
      ) : (
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
      )}
    </>
  );
};

export default App;
