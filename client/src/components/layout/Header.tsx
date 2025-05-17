import { useAuth } from "@/store/auth";
import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";

const Header = () => {
  const { user, logout } = useAuth();
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  return (
    <header className="bg-white shadow-md dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center space-x-2">
          <span className="flex items-center space-x-2">
            <span>FocusFlow</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 text-sky-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m-7 8h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </span>
        </h1>
        {/* 
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="hover:text-sky-500 transition">
            Hem
          </a>
          <a href="/about" className="hover:text-sky-500 transition">
            Om oss
          </a>
          <a href="/contact" className="hover:text-sky-500 transition">
            Kontakt
          </a>
        </nav> */}

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-[16px] text-gray-600 dark:text-gray-300">
                {`${user.name?.split(" ")[0]}'s todolist!`}
              </span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full md:w-auto"
              >
                Logga ut
              </button>
            </>
          ) : (
            <>
              <button
                onClick={loginModal.onOpen}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Logga in
              </button>
              <button
                onClick={registerModal.onOpen}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Registrera
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
