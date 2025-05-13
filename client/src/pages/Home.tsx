import TodoList from "@/components/todo/TodoList";

const Home = () => {
  return (
    <div className="w-full px-4 max-w-md flex flex-col gap-4">
      <h1 className="text-2xl font-hand text-center mt-6">📝 My ToDo-list</h1>
      <TodoList />
    </div>
  );
};

export default Home;
