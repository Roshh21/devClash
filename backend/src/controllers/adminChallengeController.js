import mongoose from 'mongoose';
import { Challenge } from '../models/Challenge.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateChallengeInput } from '../utils/challengeValidators.js';

// POST /api/admin/challenges
// Wired into the Stage A12 New Challenge form — this is what turns
// its "Coming soon" notice into a real, persisted draft.
export const createChallenge = asyncHandler(async (req, res) => {
  const { errors, data } = validateChallengeInput(req.body);
  if (errors) {
    throw new ApiError(400, 'Please fix the highlighted fields.', errors);
  }

  const challenge = await Challenge.create({
    ...data,
    status: 'draft',
    version: 1,
    createdBy: req.user._id,
  });

  res.status(201).json({ challenge: challenge.toPublicJSON() });
});

async function findChallengeOrFail(id) {
  // The Stage A12 admin Content dashboard is still mock data (its
  // rows use small numeric ids like "1") until Stage C3 wires it up —
  // so its Edit links currently 404 here rather than loading a wrong
  // or broken challenge. That's the correct, honest behavior for a
  // dashboard that doesn't know about real challenges yet, not a bug.
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(404, 'That challenge could not be found.');
  }
  const challenge = await Challenge.findById(id);
  if (!challenge) {
    throw new ApiError(404, 'That challenge could not be found.');
  }
  return challenge;
}

// GET /api/admin/challenges/:id
// Pre-fills the Edit Challenge form with real data. Admin-only for
// now, same as everything else here — Stage C4 adds the separate,
// published-only retrieval path regular users actually hit.
export const getChallenge = asyncHandler(async (req, res) => {
  const challenge = await findChallengeOrFail(req.params.id);
  res.status(200).json({ challenge: challenge.toPublicJSON() });
});

// PATCH /api/admin/challenges/:id
// Wired into the Stage A12 Edit Challenge form. Re-validates the full
// payload (the form always submits its complete state, never a
// partial patch, so there's no separate "partial update" path to
// support). Points and evaluationConfig re-derive from
// difficulty/type on every save, same as on create, since neither has
// an admin override yet.
export const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await findChallengeOrFail(req.params.id);

  const { errors, data } = validateChallengeInput(req.body);
  if (errors) {
    throw new ApiError(400, 'Please fix the highlighted fields.', errors);
  }

  Object.assign(challenge, data);
  challenge.updatedBy = req.user._id;
  await challenge.save();

  res.status(200).json({ challenge: challenge.toPublicJSON() });
});
