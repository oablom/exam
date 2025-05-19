// src/utils/dateHelpers.ts

/**
 * Returnerar true om ISO-strängens datum är exakt idag (lokal tid).
 */
export const isDueToday = (iso?: string): boolean => {
  if (!iso) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
};

/**
 * Returnerar true om ISO-strängens datum är före idag (lokal tid)
 * och inte redan är markerad som completed.
 */
export const isOverdue = (iso?: string, completed = false): boolean => {
  if (!iso || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
};

/**
 * Ger en etikett för deadline: "Idag", "Imorgon", etc.
 */
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
