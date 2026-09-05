import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hoverLift, tapScale } from '../../lib/motion';
import { cn } from '../../lib/utils';

const MotionLink = motion(Link);

const VARIANT_CLASSES = {
  primary:
    'bg-accent text-accent-contrast shadow-glass-sm hover:bg-accent-strong hover:shadow-[0_0_24px_var(--shadow-glow)]',
  secondary: 'bg-surface-strong text-primary border border-glass hover:bg-surface',
  outline: 'border border-glass-strong text-primary bg-transparent hover:bg-surface',
  ghost: 'text-primary bg-transparent hover:bg-surface',
};

const SIZE_CLASSES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    to,
    href,
    className,
    children,
    leftIcon,
    rightIcon,
    ...rest
  },
  ref
) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none disabled:opacity-50',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className
  );

  const motionProps = { whileHover: hoverLift, whileTap: tapScale };

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={classes} {...motionProps} {...rest}>
        {leftIcon}
        {children}
        {rightIcon}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a ref={ref} href={href} className={classes} {...motionProps} {...rest}>
        {leftIcon}
        {children}
        {rightIcon}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref} className={classes} {...motionProps} {...rest}>
      {leftIcon}
      {children}
      {rightIcon}
    </motion.button>
  );
});

export default Button;
