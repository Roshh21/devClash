// Backs the scripted Quick Play sequence: Finding Opponent → Victory →
// League Promotion. Nothing here is a real match — Stage F replaces
// the timers with real Socket.IO events behind these same screens.

export const OPPONENT = { name: 'ShadowX', rating: 1398, timeTaken: '10:31' };

export const MATCH_RESULT = {
  accuracy: '100%',
  testsPassed: '5/5',
  timeTaken: '08:42',
  ratingBefore: 1482,
  ratingAfter: 1506,
};

export const PROMOTION = {
  fromLeague: 'Diamond III',
  toLeague: 'Diamond II',
  ratingBefore: 1482,
  ratingAfter: 1523,
  progressPercent: 68,
};

export const VICTORY_QUOTE = 'Consistent effort leads to higher stakes.';
export const PROMOTION_QUOTE = 'Higher problems. Higher stakes.';
