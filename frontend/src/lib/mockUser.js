// A single hardcoded "logged in" identity used to build every
// authenticated screen before real auth exists. Nothing here is
// persisted or fetched — it's a local mock the app shell reads
// directly.
export const MOCK_USER = {
  name: 'Roshni',
  initials: 'R',
  rating: 1523,
  league: 'Diamond II',
  tagline: 'Building. Learning. Competing.',
  // Gates the Admin sidebar section (see components/layout/Sidebar.jsx).
  // Set to 'user' to verify the admin section correctly disappears —
  // Stage B replaces this hardcoded flag with a real enforced role.
  role: 'admin',
};
