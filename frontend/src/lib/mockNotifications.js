// Backs the notification bell dropdown and the full Notifications
// screen. Stage H replaces this with persisted, real-time
// notifications delivered over sockets.

export const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: 'friend_request',
  INVITE: 'invite',
  RESULT: 'result',
  SYSTEM: 'system',
};

export const NOTIFICATIONS = [
  {
    id: 1,
    type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    title: 'DevStorm sent you a friend request',
    time: '5m ago',
    read: false,
  },
  {
    id: 2,
    type: NOTIFICATION_TYPES.INVITE,
    title: 'CodeNinja invited you to a private match',
    time: '38m ago',
    read: false,
  },
  {
    id: 3,
    type: NOTIFICATION_TYPES.RESULT,
    title: 'You beat Alex and gained +18 rating',
    time: '3h ago',
    read: false,
  },
  {
    id: 4,
    type: NOTIFICATION_TYPES.SYSTEM,
    title: 'New challenges were added to Practice',
    time: '1d ago',
    read: true,
  },
  {
    id: 5,
    type: NOTIFICATION_TYPES.FRIEND_REQUEST,
    title: 'PixelPam sent you a friend request',
    time: '2d ago',
    read: true,
  },
  {
    id: 6,
    type: NOTIFICATION_TYPES.RESULT,
    title: 'ByteBolt beat you and you lost 12 rating',
    time: '2d ago',
    read: true,
  },
];
