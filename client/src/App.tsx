import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import Home from "@/pages/Home";
import FocusPage from "@/pages/FocusPage";
import Header from "@/components/layout/header/Header";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import InstallPrompt from "@/components/InstallPrompt";
import ToasterProvider from "@/providers/ToasterProvider";
import AuthLoader from "@/components/AuthLoader";
import BackendStatus from "./system/BackendStatus";

export default function App() {
  const { loading } = useAuth();

  return (
    <>
      <AuthLoader /> {/* Körs alltid först – även innan loading är false */}
      <BackendStatus message="Connecting to server..." />
      <BrowserRouter>
        <ToasterProvider />
        <Header />

        <main className="flex-grow flex flex-col gap-4 items-center justify-center mt-20">
          {/* Vänta med att rendera routes tills loading är klar */}
          {!loading && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/focus" element={<FocusPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
          <InstallPrompt />
        </main>

        <LoginModal />
        <RegisterModal />
      </BrowserRouter>
    </>
  );
}
