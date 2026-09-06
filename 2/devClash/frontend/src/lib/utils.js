import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge conditional class names and resolve conflicting Tailwind
// utility classes (e.g. two different `px-*` values) predictably.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
