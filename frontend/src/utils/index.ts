import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  const words: string[] = name.split(" ");
  let initials: string = "";
  for (const word of words) {
      initials += word[0];
  }
  return initials;
}