// Backs the Friends screen. Stage H swaps this for a real friend
// graph and live presence over sockets.

export const PRESENCE = {
  ONLINE: 'online',
  IN_MATCH: 'in-match',
  OFFLINE: 'offline',
};

export const FRIENDS = [
  { id: 1, name: 'ShadowX', rating: 1842, presence: PRESENCE.ONLINE },
  { id: 2, name: 'CodeNinja', rating: 1732, presence: PRESENCE.IN_MATCH },
  { id: 3, name: 'ByteBolt', rating: 1701, presence: PRESENCE.ONLINE },
  { id: 4, name: 'LogicLad', rating: 1486, presence: PRESENCE.OFFLINE },
];

export const FRIEND_REQUESTS = [
  { id: 5, name: 'DevStorm', rating: 1460 },
  { id: 6, name: 'PixelPam', rating: 1440 },
];

// A broader mock user directory the add-friend search filters over.
// Excludes people already in FRIENDS/FRIEND_REQUESTS.
export const USER_DIRECTORY = [
  { id: 7, name: 'Alex', rating: 1784 },
  { id: 8, name: 'Sam', rating: 1462 },
  { id: 9, name: 'NullPointer', rating: 1405 },
  { id: 10, name: 'QuickQuinn', rating: 1280 },
  { id: 11, name: 'HashHunter', rating: 1358 },
  { id: 12, name: 'BinaryBex', rating: 1341 },
  { id: 13, name: 'AsyncAsh', rating: 1250 },
];
