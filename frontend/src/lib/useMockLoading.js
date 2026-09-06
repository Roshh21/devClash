import { useEffect, useState } from 'react';

// Every mock-data screen uses this instead of rendering instantly,
// so the skeleton-loading pattern gets exercised now even though
// there's no real network request yet.
export function useMockLoading(delay = 650) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return loading;
}
