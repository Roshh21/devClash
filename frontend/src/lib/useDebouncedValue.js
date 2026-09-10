import { useEffect, useState } from 'react';

// Delays updating the returned value until `value` has stopped
// changing for `delay` ms. Used by AdminUsersPage so typing a search
// term fires one request after a pause, not one per keystroke.
export function useDebouncedValue(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
