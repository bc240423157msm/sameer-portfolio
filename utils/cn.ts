type ClassValue = string | number | null | undefined | false;

/**
 * Lightweight class-name combiner.
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
