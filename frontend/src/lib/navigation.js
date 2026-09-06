import {
  LayoutDashboard,
  Swords,
  Dumbbell,
  Users2,
  ListChecks,
  Trophy,
  UserPlus,
  BarChart3,
  Bell,
  Settings,
} from 'lucide-react';

// Single source of truth for the authenticated app's navigation.
// The sidebar renders from this list and the router generates one
// stub route per entry, so adding a real screen later only means
// swapping StubPage for the real one — the nav item and route stay.
export const NAV_ITEMS = [
  {
    id: 'dashboard',
    path: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Your activity feed, stats, and quick actions.',
  },
  {
    id: 'quick-play',
    path: 'quick-play',
    label: 'Quick Play',
    icon: Swords,
    description: 'Jump into a ranked 1v1 match against another developer.',
  },
  {
    id: 'practice',
    path: 'practice',
    label: 'Practice',
    icon: Dumbbell,
    description: 'Browse and solve challenges at your own pace.',
  },
  {
    id: 'team-mode',
    path: 'team-mode',
    label: 'Team Mode',
    icon: Users2,
    description: 'Team up to investigate and resolve simulated engineering incidents.',
  },
  {
    id: 'challenges',
    path: 'challenges',
    label: 'Challenges',
    icon: ListChecks,
    description: 'The full challenge library.',
  },
  {
    id: 'rankings',
    path: 'rankings',
    label: 'Rankings',
    icon: Trophy,
    description: "See how you stack up on the leaderboard.",
  },
  {
    id: 'friends',
    path: 'friends',
    label: 'Friends',
    icon: UserPlus,
    description: "Connect with other developers and see who's online.",
  },
  {
    id: 'statistics',
    path: 'statistics',
    label: 'Statistics',
    icon: BarChart3,
    description: 'A deeper look at your performance over time.',
  },
  {
    id: 'notifications',
    path: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Friend requests, invites, and match results land here.',
  },
  {
    id: 'settings',
    path: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Manage your account and preferences.',
  },
];
