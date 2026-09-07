import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Code2 } from 'lucide-react';
import ThemeToggle from '../components/ui/ThemeToggle';
import FindingOpponent from '../components/quickplay/FindingOpponent';
import VictoryScreen from '../components/quickplay/VictoryScreen';
import PromotionScreen from '../components/quickplay/PromotionScreen';

const FINDING_DURATION = 3200;
const VICTORY_DURATION = 3800;

export default function QuickPlayPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('finding');

  useEffect(() => {
    if (phase === 'finding') {
      const timeout = window.setTimeout(() => setPhase('victory'), FINDING_DURATION);
      return () => window.clearTimeout(timeout);
    }
    if (phase === 'victory') {
      const timeout = window.setTimeout(() => setPhase('promotion'), VICTORY_DURATION);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [phase]);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-primary">
      <header className="flex items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-contrast">
            <Code2 size={18} />
          </span>
          DevClash
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <AnimatePresence mode="wait">
          {phase === 'finding' && (
            <FindingOpponent key="finding" onCancel={() => navigate('/app/dashboard')} />
          )}
          {phase === 'victory' && (
            <VictoryScreen
              key="victory"
              onRematch={() => setPhase('finding')}
              onDashboard={() => navigate('/app/dashboard')}
            />
          )}
          {phase === 'promotion' && (
            <PromotionScreen
              key="promotion"
              onViewProfile={() => navigate('/app/profile')}
              onContinue={() => navigate('/app/dashboard')}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
