import { motion } from 'framer-motion';
import { slideUp } from '../lib/motion';

export default function StubPage({ label, description, icon: Icon }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideUp}
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center"
    >
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tint-accent)] text-accent">
        {Icon && <Icon size={28} />}
      </span>
      <h1 className="text-2xl font-bold text-primary">{label}</h1>
      <p className="mt-2 max-w-sm text-sm text-secondary">
        {description ?? `${label} is on the way. This screen will come alive in an upcoming build.`}
      </p>
    </motion.div>
  );
}
