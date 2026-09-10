import mongoose from 'mongoose';

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
      match: [USERNAME_REGEX, '3–20 characters: letters, numbers, and underscores only'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [EMAIL_REGEX, 'Enter a valid email address'],
    },
    // Never returned by default — controllers that need it must
    // explicitly `.select('+passwordHash')`. Keeps a stray
    // `User.find()` from ever leaking a hash by accident.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    // Every signup defaults to 'user' — the only ways to get 'admin'
    // are the seed script (scripts/seedAdmin.js, for the very first
    // one) or another admin promoting you via PATCH
    // /api/admin/users/:id/promote (Stage B5). Enforced server-side by
    // middleware/requireAdmin.js on every /api/admin/* route.
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // Set via PATCH /api/admin/users/:id/block (Stage B5) — checked by
    // both login (authController.js) and every authenticated request
    // (middleware/auth.js), so a block takes effect immediately, not
    // just on next login.
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Shape returned to the client — never the passwordHash, even though
// it's already excluded by default from queries.
userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    role: this.role,
    status: this.status,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
