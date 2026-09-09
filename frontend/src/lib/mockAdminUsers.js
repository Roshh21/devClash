// Backs the admin user management table. Stage B wires real
// list/block/promote/remove endpoints behind this same UI.

export const ADMIN_USERS = [
  { id: 1, name: 'Roshni', email: 'roshni@example.com', role: 'admin', status: 'active', joined: 'Jan 2025' },
  { id: 2, name: 'ShadowX', email: 'shadowx@example.com', role: 'user', status: 'active', joined: 'Feb 2025' },
  { id: 3, name: 'Alex', email: 'alex@example.com', role: 'user', status: 'active', joined: 'Mar 2025' },
  { id: 4, name: 'CodeNinja', email: 'codeninja@example.com', role: 'user', status: 'blocked', joined: 'Jan 2025' },
  { id: 5, name: 'ByteBolt', email: 'bytebolt@example.com', role: 'user', status: 'active', joined: 'Apr 2025' },
  { id: 6, name: 'LogicLad', email: 'logiclad@example.com', role: 'user', status: 'active', joined: 'May 2025' },
  { id: 7, name: 'DevStorm', email: 'devstorm@example.com', role: 'user', status: 'active', joined: 'Jun 2025' },
  { id: 8, name: 'Sam', email: 'sam@example.com', role: 'user', status: 'blocked', joined: 'Feb 2025' },
];
