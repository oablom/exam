import React from "react";
import LoginModal from "@/components/modals/LoginModal";
import RegisterModal from "@/components/modals/RegisterModal";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginModal />
      <RegisterModal />
    </div>
  );
};

export default App;
