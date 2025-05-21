import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import useLoginModal from "@/hooks/useLoginModal";
import Home from "@/pages/Home";
import FocusPage from "@/pages/FocusPage";
import Header from "@/components/layout/header/Header";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import InstallPwatModal from "./components/modals/InstallPwaModal";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthLoader from "@/components/AuthLoader";
import BackendStatus from "./system/BackendStatus";

export default function App() {
  const { user, loading } = useAuth();
  const loginModal = useLoginModal();

  useEffect(() => {
    if (!loading && !user) loginModal.onOpen();
  }, [loading, user]);

  return (
    <>
      <BackendStatus message="Connecting to server..." />
      <AuthLoader />
      <BrowserRouter>
        <ToasterProvider />
        <Header />

        <main className="flex-grow flex flex-col gap-4 items-center justify-center my-10 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {user && <InstallPwatModal />}
        </main>

        <LoginModal />
        <RegisterModal />
      </BrowserRouter>
    </>
  );
}
