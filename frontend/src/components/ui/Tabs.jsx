import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Tabs({ tabs, defaultTab, onChange, className }) {
  const id = useId();
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);

  function handleClick(tabId) {
    setActive(tabId);
    onChange?.(tabId);
  }

  return (
    <div className={cn('flex items-center gap-1 overflow-x-auto border-b border-glass', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => handleClick(tab.id)}
          className={cn(
            'relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors',
            active === tab.id ? 'text-primary' : 'text-secondary hover:text-primary'
          )}
        >
          {tab.label}
          {active === tab.id && (
            <motion.div
              layoutId={`tabs-underline-${id}`}
              className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
