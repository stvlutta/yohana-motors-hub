import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: string | number | null | undefined): string {
  if (price === null || price === undefined || price === "") return "";
  const str = String(price).trim();
  if (/ksh/i.test(str)) return str.replace(/^k?sh/i, "KSh");
  return `KSh ${str}`;
}
