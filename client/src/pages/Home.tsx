import { useState } from "react";
import TodoList from "@/components/todo/TodoList";
import FilterBar from "@/components/todo/FilterBar";

const Home = () => {
  const [filter, setFilter] = useState<"all" | "focus" | "quick">("all");

  return (
    <div className="w-full px-4 max-w-md flex flex-col gap-4">
      <h1 className="text-2xl font-hand text-center mt-6">
        📝 Min Att-göra-bok
      </h1>

      <FilterBar filter={filter} setFilter={setFilter} />

      <TodoList filter={filter} />
    </div>
  );
};

export default Home;
