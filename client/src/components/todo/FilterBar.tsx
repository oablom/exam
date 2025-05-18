import React from "react";

export interface FilterBarProps {
  active: 1 | 2 | 3 | null;
  onChange: (priority: 1 | 2 | 3) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ active, onChange }) => {
  return (
    <div className="flex justify-center gap-2">
      {([1, 2, 3] as const).map((priority) => {
        const isActive = active === priority;
        return (
          <button
            key={priority}
            onClick={() => onChange(priority)}
            className={`px-4 py-2 rounded-md text-white ${
              priority === 1
                ? isActive
                  ? "bg-red-600"
                  : "bg-red-300"
                : priority === 2
                ? isActive
                  ? "bg-yellow-500"
                  : "bg-yellow-300"
                : isActive
                ? "bg-green-600"
                : "bg-green-300"
            }`}
          >
            {priority === 1 ? "🔴 Hög" : priority === 2 ? "🟡 Medel" : "🟢 Låg"}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
