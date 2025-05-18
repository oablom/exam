import { Todo } from "@/types";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  children: (todo: Todo) => React.ReactNode;
}
const TodoSection: React.FC<TodoSectionProps> = ({
  title,
  todos,
  children,
}) => {
  if (todos.length === 0) return null;
  return (
    <section className="mb-6 px-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-2">
        {title} ({todos.length})
      </h2>
      <div className="flex flex-col gap-3">
        {todos.map((todo) => children(todo))}
      </div>
    </section>
  );
};

export default TodoSection;
