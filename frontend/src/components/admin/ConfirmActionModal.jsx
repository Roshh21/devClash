import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmActionModal({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirmed,
}) {
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onClose();
      onConfirmed?.();
    }, 600);
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-secondary">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant={danger ? 'outline' : 'primary'}
          className={danger ? 'border-[var(--border-danger)] text-danger hover:bg-[var(--tint-danger)]' : undefined}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Please wait…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
