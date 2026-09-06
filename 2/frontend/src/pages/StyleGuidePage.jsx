import { useState } from 'react';
import { Mail, Search } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';

const COLOR_SWATCHES = [
  { name: 'Background', var: '--color-bg' },
  { name: 'Elevated', var: '--color-bg-elevated' },
  { name: 'Surface', var: '--color-surface' },
  { name: 'Text primary', var: '--color-text-primary' },
  { name: 'Text secondary', var: '--color-text-secondary' },
  { name: 'Accent', var: '--color-accent' },
  { name: 'Sage', var: '--color-sage' },
  { name: 'Success', var: '--color-success' },
  { name: 'Warning', var: '--color-warning' },
  { name: 'Danger', var: '--color-danger' },
];

function Section({ title, description, children }) {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold text-primary">{title}</h2>
      {description && <p className="mt-1 text-sm text-secondary">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function StyleGuidePage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-primary">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-primary">Style guide</h1>
        <p className="mt-2 text-secondary">
          The shared visual language every DevClash screen is built from. Toggle the theme in the
          navbar to see it switch instantly.
        </p>

        <Section title="Colors">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {COLOR_SWATCHES.map((c) => (
              <div key={c.name} className="flex flex-col gap-2">
                <div
                  className="h-16 rounded-xl border border-glass"
                  style={{ background: `var(${c.var})` }}
                />
                <span className="text-xs text-secondary">{c.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Glass card" description="Translucent surface, backdrop blur, soft border, subtle shadow.">
          <Card hover className="max-w-md p-6">
            <p className="text-primary">
              This is the glass card primitive. Hover to see it lift.
            </p>
          </Card>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        <Section title="Inputs">
          <div className="grid max-w-md gap-4">
            <Input label="Email" placeholder="you@example.com" icon={<Mail size={16} />} />
            <Input label="Search" placeholder="Search challenges..." icon={<Search size={16} />} />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error="Password must be at least 8 characters"
            />
          </div>
        </Section>

        <Section title="Badges">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="sage">Sage</Badge>
          </div>
        </Section>

        <Section title="Tabs">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'stats', label: 'Statistics' },
              { id: 'history', label: 'History' },
            ]}
          />
        </Section>

        <Section title="Modal">
          <Button onClick={() => setModalOpen(true)}>Open modal</Button>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example modal">
            <p className="text-sm text-secondary">
              Modals use the same glass surface, fade and scale in with Framer Motion, and close on
              backdrop click or Escape.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>Confirm</Button>
            </div>
          </Modal>
        </Section>

        <Section title="Skeleton loaders" description="Used instead of spinners while content loads.">
          <div className="max-w-md space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
