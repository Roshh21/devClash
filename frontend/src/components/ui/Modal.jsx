import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { modalBackdrop, modalPanel } from '../../lib/motion';

export default function Modal({ open, onClose, title, children, className }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={modalBackdrop.initial}
          animate={modalBackdrop.animate}
          exit={modalBackdrop.exit}
          transition={modalBackdrop.transition}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={modalPanel.initial}
            animate={modalPanel.animate}
            exit={modalPanel.exit}
            transition={modalPanel.transition}
            className={cn(
              'relative z-10 w-full max-w-md rounded-2xl border border-glass bg-bg-elevated p-6 shadow-glass backdrop-blur-glass',
              className
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              {title && <h3 className="text-lg font-semibold text-primary">{title}</h3>}
              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-lg p-1 text-secondary transition-colors hover:bg-surface hover:text-primary"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
