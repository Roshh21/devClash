import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Stateless JWT, sent by the client as `Authorization: Bearer <token>`
// (not a cookie) — see backend/README.md for why. `sub` is the
// standard JWT claim name for "subject", i.e. the user id.
export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
