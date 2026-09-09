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

// Small popover-style menus (avatar menu, notification bell).
export const dropdownMenu = {
  initial: { opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: reduced ? 0 : -8, scale: reduced ? 1 : 0.97 },
  transition: { duration: reduced ? 0 : 0.15 },
};

// Modal backdrop + panel (Modal.jsx).
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: reduced ? 0 : 0.15 },
};

export const modalPanel = {
  initial: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: reduced ? 1 : 0.96, y: reduced ? 0 : 12 },
  transition: { duration: reduced ? 0 : 0.2, ease: EASE_STANDARD },
};

// Off-canvas drawer slide-in (mobile sidebar).
export const drawerSlide = {
  initial: { x: reduced ? 0 : '-100%' },
  animate: { x: 0 },
  exit: { x: reduced ? 0 : '-100%' },
  transition: { duration: reduced ? 0 : 0.25, ease: EASE_STANDARD },
};

// Height-expand for collapsible sections (mobile nav menu).
export const heightExpand = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: reduced ? 0 : 0.25, ease: EASE_STANDARD },
};

export const pageTransition = {
  initial: { opacity: 0, y: reduced ? 0 : 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: reduced ? 0 : -8 },
  transition: { duration: reduced ? 0 : 0.25, ease: EASE_STANDARD },
};

// A lighter version of pageTransition for small in-place content
// swaps (tab content, auth mode switch) — same shape, shorter throw
// and duration, still reduced-motion aware. Spread directly onto a
// motion.div: <motion.div key={activeTab} {...tabContentTransition}>
export const tabContentTransition = {
  initial: { opacity: 0, y: reduced ? 0 : 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: reduced ? 0 : -8 },
  transition: { duration: reduced ? 0 : 0.2, ease: EASE_STANDARD },
};
