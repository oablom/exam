export const isDueToday = (iso?: string): boolean => {
  if (!iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
};

export const isOverdue = (iso?: string, completed = false): boolean => {
  if (!iso || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
};

export const deadlineLabel = (iso?: string): string => {
  if (!iso) return "Ingen";
  const date = new Date(iso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = date.setHours(0, 0, 0, 0) - today.getTime();
  const day = 86_400_000;
  if (diffMs === 0) return "Idag";
  if (diffMs === day) return "Imorgon";
  if (diffMs > 0 && diffMs <= 6 * day) return "Den här veckan";
  if (diffMs > 6 * day && diffMs <= 13 * day) return "Nästa vecka";
  return date.toLocaleDateString("sv-SE");
};
