export type View = "all" | "today" | "overdue" | "upcoming" | "noDate" | "prio";

export function matchesView(
  view: View,
  dueDate: string,
  todayKey: string
): boolean {
  switch (view) {
    case "all":
      return true;
    case "today":
      return dueDate === todayKey || (dueDate !== "" && dueDate < todayKey);
    case "overdue":
      return dueDate !== "" && dueDate < todayKey;
    case "upcoming":
      return dueDate > todayKey;
    case "noDate":
      return dueDate === "";
    case "prio":
      return false;
    default:
      return true;
  }
}
