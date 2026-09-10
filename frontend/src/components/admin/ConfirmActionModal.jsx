import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InlineNotice from '../ui/InlineNotice';

// Stage B5: `onConfirm` is now a real async action (an API call) that
// can fail — e.g. "can't remove the only remaining admin account".
// On failure the modal stays open and shows the error inline instead
// of closing, so the admin sees *why* without losing the context of
// which account they were acting on.
export default function ConfirmActionModal({
  open,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Every dismissal path (backdrop, Escape, X, Cancel) funnels through
  // here — clears any stale error from a previous attempt so the next
  // time this opens it starts clean, and no-ops while a request is in
  // flight so a stray click can't leave the caller unsure whether the
  // action went through.
  function handleClose() {
    if (loading) return;
    setError(null);
    onClose?.();
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      await onConfirm?.();
      setLoading(false);
      handleClose();
    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={title}>
      <p className="text-sm text-secondary">{description}</p>
      <InlineNotice message={error} tone="danger" />
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
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
