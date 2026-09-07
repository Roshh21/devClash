// Backs the Rankings screen. Stage K wires this to a real indexed
// leaderboard query behind the same tabs/table.

export const GLOBAL_LEADERBOARD = [
  { position: 1, name: 'ShadowX', rating: 1842 },
  { position: 2, name: 'Alex', rating: 1784 },
  { position: 3, name: 'CodeNinja', rating: 1732 },
  { position: 4, name: 'ByteBolt', rating: 1701 },
  { position: 5, name: 'Roshni', rating: 1523, isCurrentUser: true },
  { position: 6, name: 'LogicLad', rating: 1486 },
  { position: 7, name: 'DevStorm', rating: 1460 },
  { position: 8, name: 'Sam', rating: 1462 },
  { position: 9, name: 'PixelPam', rating: 1440 },
  { position: 10, name: 'ByteQueen', rating: 1421 },
  { position: 11, name: 'NullPointer', rating: 1405 },
  { position: 12, name: 'StackOverflo', rating: 1390 },
  { position: 13, name: 'RecursiveRex', rating: 1372 },
  { position: 14, name: 'HashHunter', rating: 1358 },
  { position: 15, name: 'BinaryBex', rating: 1341 },
  { position: 16, name: 'LoopLuna', rating: 1325 },
  { position: 17, name: 'GreedyGary', rating: 1310 },
  { position: 18, name: 'MergeMax', rating: 1298 },
  { position: 19, name: 'QuickQuinn', rating: 1280 },
  { position: 20, name: 'DebugDana', rating: 1265 },
  { position: 21, name: 'AsyncAsh', rating: 1250 },
  { position: 22, name: 'CacheCleo', rating: 1234 },
  { position: 23, name: 'ForkFinn', rating: 1218 },
  { position: 24, name: 'SyntaxSia', rating: 1200 },
];

export const FRIENDS_LEADERBOARD = [
  { position: 1, name: 'ShadowX', rating: 1842 },
  { position: 2, name: 'CodeNinja', rating: 1732 },
  { position: 3, name: 'Roshni', rating: 1523, isCurrentUser: true },
  { position: 4, name: 'LogicLad', rating: 1486 },
];

export const SEASON_LEADERBOARD = [
  { position: 1, name: 'CodeNinja', rating: 1710 },
  { position: 2, name: 'ShadowX', rating: 1695 },
  { position: 3, name: 'Alex', rating: 1650 },
  { position: 4, name: 'Roshni', rating: 1540, isCurrentUser: true },
  { position: 5, name: 'ByteBolt', rating: 1522 },
  { position: 6, name: 'LogicLad', rating: 1470 },
  { position: 7, name: 'Sam', rating: 1445 },
  { position: 8, name: 'DevStorm', rating: 1410 },
];

export function getLeagueForRating(rating) {
  if (rating >= 1800) return 'Master';
  if (rating >= 1650) return 'Diamond I';
  if (rating >= 1500) return 'Diamond II';
  if (rating >= 1350) return 'Diamond III';
  return 'Platinum';
}
