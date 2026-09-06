import { motion } from 'framer-motion';
import { Users, LayoutGrid, Zap, GraduationCap } from 'lucide-react';
import { slideUp, staggerContainer } from '../../lib/motion';

const STATS = [
  { icon: Users, value: '10k', label: 'Developers' },
  { icon: LayoutGrid, value: '50+', label: 'Challenge Types' },
  { icon: Zap, value: 'Real-time', label: 'Multiplayer' },
  { icon: GraduationCap, value: 'Learn', label: 'By Competing' },
];

export default function FeatureStrip() {
  return (
    <section id="features" className="border-y border-glass bg-bg-elevated">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={staggerContainer(0.08)}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8"
      >
      
        {STATS.map(({ icon: Icon, value, label }) => (
          <motion.div key={label} variants={slideUp} className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tint-accent)] text-accent">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-lg font-bold text-primary">{value}</p>
              <p className="text-sm text-secondary">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
