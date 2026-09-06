// All dashboard numbers come from this one file. Every card reads
// its shape from here rather than hardcoding values inline, so a
// real API response can replace this file later without touching
// any layout code.

export const DASHBOARD_STATS = {
  rating: { value: 1482, deltaWeek: 24 },
  winRate: { value: 68 },
  streak: { value: 7, best: 12 },
  totalMatches: { value: 128, trend: [4, 6, 3, 8, 5, 9, 7] },
};

export const YOUR_RANK = {
  league: 'Diamond III',
  points: 1767,
  nextThreshold: 2050,
};

export const RECENT_MATCHES = [
  { id: 1, opponent: 'ShadowX', result: 'win', delta: 24, timeAgo: '2m ago' },
  { id: 2, opponent: 'Alex', result: 'loss', delta: -18, timeAgo: '1h ago' },
  { id: 3, opponent: 'CodeNinja', result: 'win', delta: 21, timeAgo: '3h ago' },
  { id: 4, opponent: 'ByteBolt', result: 'win', delta: 25, timeAgo: '5h ago' },
  { id: 5, opponent: 'LogicLad', result: 'loss', delta: -12, timeAgo: '1d ago' },
];

export const CHALLENGE_OF_DAY = {
  title: 'Fix the Broken Authentication',
  tags: ['Backend', 'Debugging'],
  description:
    'Users are unable to log in after the latest deployment. Investigate and fix the issue.',
};

export const DASHBOARD_QUOTE = 'A better engineer every day.';
