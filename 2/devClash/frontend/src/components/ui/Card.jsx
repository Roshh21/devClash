import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { hoverLift } from '../../lib/motion';

// The "glass card" primitive: translucent surface, backdrop blur,
// a soft 1px border, a subtle shadow, and large rounded corners.
// Every later screen builds its cards from this instead of
// one-off styling.
const Card = forwardRef(function Card({ hover = false, className, children, ...rest }, ref) {
  return (
    <motion.div
      ref={ref}
      whileHover={hover ? hoverLift : undefined}
      className={cn(
        'rounded-2xl border border-glass bg-surface shadow-glass backdrop-blur-glass',
        hover && 'cursor-pointer',
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
});

export default Card;
