import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateSignup, validateLogin } from '../utils/validators.js';
import { signToken } from '../utils/token.js';

const SALT_ROUNDS = 12;

// POST /api/auth/signup
// Wired into the Stage A3 signup form — this is what turns its
// "Coming soon" toast into a real account.
export const signup = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body || {};

  const errors = validateSignup({ username, email, password });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Please fix the highlighted fields.', errors);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim();

  // Explicit pre-check gives a friendlier, field-targeted error than
  // waiting for the unique-index race to throw (errorHandler.js still
  // catches that race as a fallback).
  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  }).lean();

  if (existing) {
    const dupErrors = {};
    if (existing.email === normalizedEmail) dupErrors.email = 'This email is already registered.';
    if (existing.username === normalizedUsername) dupErrors.username = 'This username is taken.';
    throw new ApiError(409, 'An account with these details already exists.', dupErrors);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash,
  });

  const token = signToken(user._id);
  res.status(201).json({ user: user.toPublicJSON(), token });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length > 0) {
    throw new ApiError(400, 'Please fix the highlighted fields.', errors);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

  // Deliberately generic — never reveal whether it was the email or
  // the password that was wrong.
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.status === 'blocked') {
    throw new ApiError(403, 'This account has been blocked. Contact support for help.', undefined, 'ACCOUNT_BLOCKED');
  }

  const token = signToken(user._id);
  res.status(200).json({ user: user.toPublicJSON(), token });
});

// GET /api/auth/me (requireAuth)
// Lets the frontend hydrate its auth store from a stored token on
// page load/refresh instead of asking the user to log in again.
export const me = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user.toPublicJSON() });
});

// POST /api/auth/logout
// Stateless JWT means there's no server-side session to destroy yet —
// the client just deletes its stored token. This endpoint exists so
// the frontend always has something to call, and so a real token
// blocklist can be added later without changing that contract.
export const logout = asyncHandler(async (req, res) => {
  res.status(200).json({ message: 'Logged out.' });
});
