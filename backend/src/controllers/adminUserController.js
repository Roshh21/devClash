import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// GET /api/admin/users?search=&page=&limit=
export const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT));
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';

  const filter = search
    ? {
        $or: [
          { username: new RegExp(escapeRegExp(search), 'i') },
          { email: new RegExp(escapeRegExp(search), 'i') },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    users: users.map((u) => u.toPublicJSON()),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

async function findTargetOrFail(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, 'Invalid account id.');
  }
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'That account could not be found.');
  }
  return user;
}

// Shared safeguard for demote/remove/block: refuse to leave the
// system with zero admins. Counts everyone *except* the target, so
// "the only remaining admin" is judged correctly whether or not the
// caller is acting on their own account.
async function assertNotOnlyRemainingAdmin(user, action) {
  if (user.role !== 'admin') return;
  const otherAdmins = await User.countDocuments({ role: 'admin', _id: { $ne: user._id } });
  if (otherAdmins === 0) {
    throw new ApiError(400, `Can't ${action} the only remaining admin account.`);
  }
}

// PATCH /api/admin/users/:id/block
export const blockUser = asyncHandler(async (req, res) => {
  const user = await findTargetOrFail(req.params.id);
  await assertNotOnlyRemainingAdmin(user, 'block');
  user.status = 'blocked';
  await user.save();
  res.status(200).json({ user: user.toPublicJSON() });
});

// PATCH /api/admin/users/:id/unblock
export const unblockUser = asyncHandler(async (req, res) => {
  const user = await findTargetOrFail(req.params.id);
  user.status = 'active';
  await user.save();
  res.status(200).json({ user: user.toPublicJSON() });
});

// PATCH /api/admin/users/:id/promote
export const promoteUser = asyncHandler(async (req, res) => {
  const user = await findTargetOrFail(req.params.id);
  user.role = 'admin';
  await user.save();
  res.status(200).json({ user: user.toPublicJSON() });
});

// PATCH /api/admin/users/:id/demote
export const demoteUser = asyncHandler(async (req, res) => {
  const user = await findTargetOrFail(req.params.id);
  await assertNotOnlyRemainingAdmin(user, 'demote');
  user.role = 'user';
  await user.save();
  res.status(200).json({ user: user.toPublicJSON() });
});

// DELETE /api/admin/users/:id
export const removeUser = asyncHandler(async (req, res) => {
  const user = await findTargetOrFail(req.params.id);
  await assertNotOnlyRemainingAdmin(user, 'remove');
  await user.deleteOne();
  res.status(200).json({ message: 'Account removed.', id: req.params.id });
});
