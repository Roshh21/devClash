import { ApiError } from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

// Every route funnels errors here (via asyncHandler) instead of each
// controller shaping its own response — one place decides the JSON
// error contract the frontend's api.js relies on:
//   { message: string, errors?: { [field]: string } }
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }

  // Unique-index race (two signups for the same email at once) —
  // belt-and-suspenders alongside the explicit pre-check in
  // authController, which handles the common case with a nicer message.
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      message: `That ${field} is already in use.`,
      errors: { [field]: `This ${field} is already taken.` },
    });
  }

  // Mongoose schema validation errors (e.g. a bad username pattern
  // that slipped past the manual validator).
  if (err.name === 'ValidationError') {
    const errors = {};
    for (const key of Object.keys(err.errors)) {
      errors[key] = err.errors[key].message;
    }
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  console.error('[error]', err);
  return res.status(500).json({
    message: 'Something went wrong on our end. Please try again.',
    ...(isProduction ? {} : { detail: err.message }),
  });
}
