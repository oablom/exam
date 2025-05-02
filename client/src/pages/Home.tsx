// src/pages/Home.tsx
import React from "react";
import useLoginModal from "../hooks/useLoginModal";
import LoginModal from "@/components/modals/LoginModal";

const Home = () => {
  const loginModal = useLoginModal();

  return (
    <>
      <LoginModal />
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-4xl font-bold">Välkommen till startsidan!</h1>
        <button
          onClick={loginModal.onOpen}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Logga in
        </button>
      </div>
    </>
  );
};

export default Home;
