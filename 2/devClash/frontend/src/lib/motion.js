// Shared Framer Motion presets.
// Every animated component in the app pulls from here instead of
// hand-rolling its own transition, so motion stays consistent and
// reduced-motion support only has to be handled in one place.

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const reduced = prefersReducedMotion();

export const EASE_STANDARD = [0.4, 0, 0.2, 1];

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE_STANDARD },
  },
};

export const slideUp = {
  hidden: { opacity: 0, y: reduced ? 0 : 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: reduced ? 0 : 0.5, ease: EASE_STANDARD },
  },
};

export function staggerContainer(stagger = 0.1, delayChildren = 0) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduced ? 0 : stagger,
        delayChildren: reduced ? 0 : delayChildren,
      },
    },
  };
}

export const hoverLift = reduced
  ? {}
  : { y: -4, transition: { duration: 0.2, ease: EASE_STANDARD } };

export const tapScale = reduced ? {} : { scale: 0.97 };

export const pageTransition = {
  initial: { opacity: 0, y: reduced ? 0 : 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: reduced ? 0 : -8 },
  transition: { duration: reduced ? 0 : 0.25, ease: EASE_STANDARD },
};
