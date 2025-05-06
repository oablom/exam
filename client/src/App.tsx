import React from "react";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";
import Home from "@/pages/Home";
import ToasterProvider from "@/providers/ToasterProvider";
import Header from "@/components/layout/Header";
import AuthLoader from "@/components/AuthLoader";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <ToasterProvider />
      <AuthLoader />
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <Home />
      </main>
      <LoginModal />
      <RegisterModal />
    </div>
  );
};

export default App;
