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
};
