import { Binary, Boxes, Bug, Database, GitBranch, Globe, Rows3, Share2 } from 'lucide-react';

// Practice's category grid and challenge list both read from this
// one local catalogue. Stage C's retrieval API replaces it later
// behind the same filter UI.

export const CATEGORIES = [
  { id: 'arrays', label: 'Arrays', icon: Rows3, count: 78 },
  { id: 'dp', label: 'Dynamic Programming', icon: GitBranch, count: 52 },
  { id: 'system-design', label: 'System Design', icon: Boxes, count: 42 },
  { id: 'binary-search', label: 'Binary Search', icon: Binary, count: 36 },
  { id: 'graphs', label: 'Graphs', icon: Share2, count: 48 },
  { id: 'sql', label: 'Database (SQL)', icon: Database, count: 28 },
  { id: 'debugging', label: 'Debugging', icon: Bug, count: 20 },
  { id: 'web-dev', label: 'Web Development', icon: Globe, count: 44 },
];

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const CHALLENGES = [
  {
    id: 1,
    title: 'Two Sum',
    category: 'arrays',
    difficulty: 'Easy',
    type: 'Coding',
    estimatedTime: '15 min',
    completed: true,
  },
  {
    id: 2,
    title: 'Longest Increasing Subsequence',
    category: 'dp',
    difficulty: 'Hard',
    type: 'Coding',
    estimatedTime: '35 min',
    completed: false,
  },
  {
    id: 3,
    title: 'Design a Rate Limiter',
    category: 'system-design',
    difficulty: 'Medium',
    type: 'System Design',
    estimatedTime: '40 min',
    completed: false,
  },
  {
    id: 4,
    title: 'Search in a Rotated Sorted Array',
    category: 'binary-search',
    difficulty: 'Medium',
    type: 'Coding',
    estimatedTime: '20 min',
    completed: true,
  },
  {
    id: 5,
    title: 'Shortest Path in a Graph',
    category: 'graphs',
    difficulty: 'Hard',
    type: 'Coding',
    estimatedTime: '30 min',
    completed: false,
  },
  {
    id: 6,
    title: 'Top 5 Customers by Revenue',
    category: 'sql',
    difficulty: 'Easy',
    type: 'SQL',
    estimatedTime: '10 min',
    completed: true,
  },
  {
    id: 7,
    title: 'Fix the Broken Authentication',
    category: 'debugging',
    difficulty: 'Medium',
    type: 'Debugging',
    estimatedTime: '25 min',
    completed: false,
  },
  {
    id: 8,
    title: 'Build a Debounced Search Input',
    category: 'web-dev',
    difficulty: 'Medium',
    type: 'Coding',
    estimatedTime: '20 min',
    completed: false,
  },
  {
    id: 9,
    title: 'Valid Parentheses',
    category: 'arrays',
    difficulty: 'Easy',
    type: 'Coding',
    estimatedTime: '10 min',
    completed: true,
  },
  {
    id: 10,
    title: 'Coin Change',
    category: 'dp',
    difficulty: 'Medium',
    type: 'Coding',
    estimatedTime: '25 min',
    completed: false,
  },
  {
    id: 11,
    title: 'Normalize a Relational Schema',
    category: 'sql',
    difficulty: 'Hard',
    type: 'SQL',
    estimatedTime: '30 min',
    completed: false,
  },
  {
    id: 12,
    title: 'Predict the Console Output',
    category: 'web-dev',
    difficulty: 'Easy',
    type: 'Output',
    estimatedTime: '8 min',
    completed: false,
  },
];
