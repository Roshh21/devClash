import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './motion';

// Powers the "animated counters" part of the shared design language.
// Counts up from 0 to `target` using an eased requestAnimationFrame
// loop, or jumps straight to the target when reduced motion is on.
export function useCountUp(target, duration = 900) {
  const reduced = prefersReducedMotion();
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (reduced) return undefined;

    let start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    }
    frameRef.current = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, reduced]);

  return reduced ? target : value;
}
