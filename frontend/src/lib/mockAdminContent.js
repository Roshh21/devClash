// Backs the admin content dashboard and challenge form. Stage C
// makes this real: create/edit endpoints, a review/publish workflow,
// and a retrieval API behind the same UI.

export const CONTENT_STATUS_COUNTS = { draft: 8, review: 3, published: 42, archived: 5 };

export const CHALLENGE_TYPES = ['MCQ', 'Output', 'Coding', 'Debugging', 'SQL'];

export const ADMIN_CHALLENGES = [
  { id: 1, title: 'Two Sum', type: 'Coding', category: 'Arrays', status: 'published', updatedAt: '2 days ago' },
  {
    id: 2,
    title: 'Fix the Broken Authentication',
    type: 'Debugging',
    category: 'Debugging',
    status: 'published',
    updatedAt: '5 days ago',
  },
  {
    id: 3,
    title: 'Design a Rate Limiter',
    type: 'Coding',
    category: 'System Design',
    status: 'review',
    updatedAt: '1 day ago',
  },
  {
    id: 4,
    title: 'Normalize a Relational Schema',
    type: 'SQL',
    category: 'Database (SQL)',
    status: 'draft',
    updatedAt: '3 hours ago',
  },
  {
    id: 5,
    title: 'Predict the Console Output',
    type: 'Output',
    category: 'Web Development',
    status: 'draft',
    updatedAt: '1 hour ago',
  },
  {
    id: 6,
    title: 'JavaScript Fundamentals Quiz',
    type: 'MCQ',
    category: 'Web Development',
    status: 'archived',
    updatedAt: '2 months ago',
  },
  {
    id: 7,
    title: 'Longest Increasing Subsequence',
    type: 'Coding',
    category: 'Dynamic Programming',
    status: 'published',
    updatedAt: '1 week ago',
  },
  {
    id: 8,
    title: 'Top 5 Customers by Revenue',
    type: 'SQL',
    category: 'Database (SQL)',
    status: 'review',
    updatedAt: '6 hours ago',
  },
];

export const STATUS_VARIANT = {
  draft: 'default',
  review: 'warning',
  published: 'success',
  archived: 'sage',
};

export function emptyFormValues(type) {
  const base = {
    title: '',
    type,
    category: '',
    difficulty: 'Easy',
    estimatedTime: '',
    description: '',
  };

  switch (type) {
    case 'MCQ':
      return { ...base, options: ['', '', '', ''], correctOption: 0 };
    case 'Output':
      return { ...base, codeSnippet: '', expectedOutput: '' };
    case 'Debugging':
      return { ...base, buggyCode: '', expectedFix: '' };
    case 'SQL':
      return { ...base, schema: '', expectedResult: '' };
    case 'Coding':
    default:
      return { ...base, starterCode: '', testCases: [{ input: '', expected: '' }] };
  }
}
