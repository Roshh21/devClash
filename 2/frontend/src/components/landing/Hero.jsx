import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import Button from '../ui/Button';
import CodeWindowMock from './CodeWindowMock';
import { fadeIn, slideUp, staggerContainer } from '../../lib/motion';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer(0.12)}>
          <motion.h1
            variants={slideUp}
            className="text-4xl font-extrabold leading-[1.1] tracking-tight text-primary sm:text-5xl lg:text-6xl"
          >
            Sharpen
            <br />
            Your <span className="text-accent">Engineering</span>
            <br />
            Instincts.
          </motion.h1>

          <motion.p variants={slideUp} className="mt-6 max-w-md text-lg text-secondary">
            Compete. Debug. Collaborate.
            <br />
            Solve real-world problems.
          </motion.p>

          <motion.div variants={slideUp} className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/signup" size="lg" rightIcon={<ArrowRight size={18} />}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" leftIcon={<PlayCircle size={18} />}>
              View Demo
            </Button>
          </motion.div>

          <motion.p variants={slideUp} className="mt-10 font-mono text-sm text-tertiary">
            // Real problems. Real developers. A better you.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
          className="relative mx-auto w-full max-w-md"
        >
          <CodeWindowMock />
        </motion.div>
      </div>
    </section>
  );
}
