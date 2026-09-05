import { motion } from 'framer-motion';
import { ArrowLeft, Construction } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { slideUp } from '../lib/motion';

export default function ComingSoonPage({ title, description }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-primary">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <motion.div initial="hidden" animate="visible" variants={slideUp} className="w-full max-w-md">
          <Card className="flex flex-col items-center p-10 text-center">
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--tint-accent)] text-accent">
              <Construction size={26} />
            </span>
            <h1 className="text-2xl font-bold text-primary">{title}</h1>
            <p className="mt-3 text-sm text-secondary">{description}</p>
            <Button to="/" variant="outline" className="mt-8" leftIcon={<ArrowLeft size={16} />}>
              Back to home
            </Button>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
