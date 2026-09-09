import { Coffee } from 'lucide-react';
import Card from '../ui/Card';
import { useReducedMotion } from '../../lib/useReducedMotion';

// A CSS/SVG-only stand-in for a "developer workspace" photo: a mock
// code editor window plus a small floating note, both built from the
// same glass Card primitive used everywhere else in the app.
const CODE_LINES = [
  [
    { t: 'function', c: 'text-accent' },
    { t: ' sharpenSkills(', c: 'text-primary' },
    { t: 'you', c: 'text-sage' },
    { t: ') {', c: 'text-primary' },
  ],
  [
    { t: '  while', c: 'text-accent' },
    { t: ' (you.', c: 'text-primary' },
    { t: 'isImproving', c: 'text-sage' },
    { t: '()) {', c: 'text-primary' },
  ],
  [
    { t: '    const', c: 'text-accent' },
    { t: ' challenge = ', c: 'text-primary' },
    { t: 'pickChallenge', c: 'text-sage' },
    { t: "('random');", c: 'text-primary' },
  ],
  [{ t: '    you.solve(challenge);', c: 'text-secondary' }],
  [{ t: '    you.rating += challenge.reward;', c: 'text-secondary' }],
  [{ t: '  }', c: 'text-primary' }],
  [
    { t: '  return', c: 'text-accent' },
    { t: ' you; ', c: 'text-primary' },
    { t: '// sharper than yesterday', c: 'text-tertiary' },
  ],
  [{ t: '}', c: 'text-primary' }],
];

export default function CodeWindowMock() {
  const reduced = useReducedMotion();
  const lastLine = CODE_LINES.length - 1;

  return (
    <div className="relative">
      <Card
        initial={{ opacity: 0, y: reduced ? 0 : 24, rotate: -1 }}
        animate={{ opacity: 1, y: 0, rotate: -1 }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden"
      >
        <div className="flex items-center gap-2 border-b border-glass px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-danger" />
          <span className="h-3 w-3 rounded-full bg-warning" />
          <span className="h-3 w-3 rounded-full bg-success" />
          <span className="ml-3 font-mono text-xs text-tertiary">sharpen.js</span>
        </div>
        <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
          {CODE_LINES.map((line, i) => (
            <div key={i}>
              {line.map((tok, j) => (
                <span key={j} className={tok.c}>
                  {tok.t}
                </span>
              ))}
              {i === lastLine && (
                <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse align-middle bg-accent" />
              )}
            </div>
          ))}
        </pre>
      </Card>

      <Card
        initial={{ opacity: 0, y: reduced ? 0 : 16, rotate: 3 }}
        animate={{ opacity: 1, y: 0, rotate: 3 }}
        transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="absolute -bottom-6 -left-6 hidden w-48 p-4 sm:block"
      >
        <Coffee size={16} className="mb-2 text-accent" />
        <p className="font-mono text-xs italic text-secondary">
          &ldquo;Discipline builds freedom.&rdquo;
        </p>
      </Card>
    </div>
  );
}
