import { useState } from 'react';
import { User, Quote } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { MOCK_USER } from '../../lib/mockUser';

export default function EditProfileModal({ open, onClose, onSaved }) {
  const [name, setName] = useState(MOCK_USER.name);
  const [tagline, setTagline] = useState(MOCK_USER.tagline);
  const [saving, setSaving] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      onClose();
      onSaved?.();
    }, 700);
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit profile">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Display name"
          icon={<User size={16} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Tagline"
          icon={<Quote size={16} />}
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
