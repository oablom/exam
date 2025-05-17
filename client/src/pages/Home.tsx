import TodoList from "@/components/todo/TodoList";
import { useAuth } from "@/store/auth";

const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="w-full px-4 max-w-md flex flex-col gap-4">
        <h1 className="text-center text-xl font-bold">
          Logga in för att se dina todo
        </h1>
      </div>
    );
  }
  return (
    <div className="w-full px-4 max-w-md flex flex-col gap-4">
      <h1 className="text-center text-xl font-bold">Fokuslistan topp 📝</h1>
      <TodoList />
    </div>
  );
};

export default Home;
