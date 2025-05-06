import React from "react";
import useLoginModal from "../hooks/useLoginModal";
import LoginModal from "@/components/modals/LoginModal";

import TodoList from "@/components/todo/TodoList";
const Home = () => {
  const loginModal = useLoginModal();

  return (
    <>
      <LoginModal />
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-4xl font-bold">Välkommen till startsidan!</h1>
        <TodoList></TodoList>
      </div>
    </>
  );
};

export default Home;
