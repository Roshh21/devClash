import { Link } from 'react-router-dom';
import { Code2, MessageCircle, Globe, Rss } from 'lucide-react';

const FOOTER_LINKS = {
  Product: ['Features', 'Challenges', 'Leaderboards', 'Pricing'],
  Company: ['About', 'Blog', 'Careers'],
  Resources: ['Docs', 'Community', 'Support'],
};

export default function Footer() {
  return (
    <footer className="border-t border-glass bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-primary">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-contrast">
                <Code2 size={18} />
              </span>
              DevClash
            </Link>
            <p className="mt-4 max-w-xs text-sm text-secondary">
              Sharpen your engineering instincts. Compete, debug, and collaborate with developers
              worldwide.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Globe, MessageCircle, Rss].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-glass text-secondary transition-colors hover:text-primary"
                >
                  <Icon size={16} />
                </span>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-sm font-semibold text-primary">{heading}</p>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <span className="cursor-default text-sm text-secondary" title="Coming soon">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-glass pt-6 text-xs text-tertiary sm:flex-row">
          <p>© {new Date().getFullYear()} DevClash. All rights reserved.</p>
          <p className="font-mono">// Real problems. Real developers. A better you.</p>
        </div>
      </div>
    </footer>
  );
}
