interface FilterBarProps {
  filter: "all" | "focus" | "quick";
  setFilter: (f: "all" | "focus" | "quick") => void;
}

const FilterBar = ({ filter, setFilter }: FilterBarProps) => (
  <div className="flex justify-center gap-2 mt-2">
    {(["all", "focus", "quick"] as const).map((f) => (
      <button
        key={f}
        className={`px-3 py-1 rounded-full text-sm border ${
          filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-600"
        }`}
        onClick={() => setFilter(f)}
      >
        {f === "all" && "All"}
        {f === "focus" && "🎯 Focus"}
        {f === "quick" && "⚡ Quick tasks"}
      </button>
    ))}
  </div>
);

export default FilterBar;
