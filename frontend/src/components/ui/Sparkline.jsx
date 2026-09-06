import { motion } from 'framer-motion';
import { staggerContainer } from '../../lib/motion';

const barVariants = {
  hidden: { scaleY: 0 },
  visible: { scaleY: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function Sparkline({ values = [], height = 32, className = '' }) {
  const max = Math.max(...values, 1);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer(0.06)}
      className={`flex items-end gap-1 ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      {values.map((v, i) => (
        <motion.span
          key={i}
          variants={barVariants}
          style={{
            height: `${Math.max((v / max) * 100, 12)}%`,
            transformOrigin: 'bottom',
          }}
          className="w-1.5 rounded-full bg-accent"
        />
      ))}
    </motion.div>
  );
}
