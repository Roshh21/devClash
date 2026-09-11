import mongoose from 'mongoose';

// The five initial challenge types (C1's DoD: "Schema supports all
// five initial types") — kept as a named export so the admin
// controller/validator and this model can never drift apart on what
// counts as valid.
export const CHALLENGE_TYPES = ['MCQ', 'Output', 'Coding', 'Debugging', 'SQL'];
export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

// Draft → Review → Approved → Published → Active → Archived, per the
// roadmap's Stage C3. Only 'draft' is ever set right now (C2's DoD:
// "status defaults to Draft") — the rest of this enum exists so C3
// can implement the actual transitions without a schema migration.
export const CHALLENGE_STATUSES = ['draft', 'review', 'approved', 'published', 'active', 'archived'];

// content: type-specific — this is the "one schema, type-specific
// content" contract C1 asks for. Deliberately Mixed rather than five
// separate sub-schemas or a Mongoose discriminator: the real
// enforcement of "what shape does MCQ content have" lives in
// utils/challengeValidators.js (mirroring the frontend's own
// type-aware form almost field-for-field), which is easier to keep in
// sync with that form than a second, parallel schema-level definition
// would be. See DevClash-Bank/docs/CHALLENGE_SCHEMA.md for the full
// documented shape per type.
//   MCQ:       { options: [String] (exactly 4), correctOptionIndex: Number (0-3) }
//   Output:    { codeSnippet: String, expectedOutput: String }
//   Debugging: { buggyCode: String, expectedFix: String }
//   SQL:       { schema: String, expectedResult: String }
//   Coding:    { starterCode: String, testCases: [{ input: String, expected: String }] }
//
// evaluationConfig: also type-specific and also Mixed — Stage D's
// evaluators are what actually read this. For now it's populated with
// a sensible default per type (see utils/challengeValidators.js) since
// there's no admin UI to configure it yet.
const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    type: { type: String, required: true, enum: CHALLENGE_TYPES },
    // Free text for now, matching what the Stage A12 admin form
    // already sends (a category *label* like "Dynamic Programming").
    // Practice's catalogue (frontend/src/lib/mockChallenges.js) keys
    // categories by a short *slug* instead ('dp'). Reconciling the
    // two — so Stage C4's retrieval API can filter consistently — is
    // deliberately left to Stage C4, when there's an actual consumer
    // to design it against, rather than guessed at here.
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, enum: DIFFICULTIES },
    tags: { type: [String], default: [] },
    description: { type: String, required: true, trim: true },
    // Parsed server-side from the admin form's free-text "estimated
    // time" (e.g. "20 min") — see utils/challengeValidators.js. A
    // real number of minutes now exists for the challenge player's
    // timer and Stage D's scoring to use later, without needing a new
    // form field yet.
    timeLimitMinutes: { type: Number, required: true, min: 1 },
    // No admin UI for this yet either — defaulted from difficulty
    // (Easy/Medium/Hard → 10/20/30) in utils/challengeValidators.js.
    points: { type: Number, required: true, min: 0 },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    evaluationConfig: { type: mongoose.Schema.Types.Mixed, required: true },
    // Shown after submission per Stage A8/D2 — no form field for it
    // yet, so it defaults empty until authoring UI for it exists.
    explanation: { type: String, default: '', trim: true },
    status: { type: String, required: true, enum: CHALLENGE_STATUSES, default: 'draft' },
    // Exists from day one per C1's DoD. Stage K4 is what actually
    // increments it on edit and keeps historical versions queryable —
    // for now it's just always 1.
    version: { type: Number, required: true, default: 1 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

challengeSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    title: this.title,
    type: this.type,
    category: this.category,
    difficulty: this.difficulty,
    tags: this.tags,
    description: this.description,
    timeLimitMinutes: this.timeLimitMinutes,
    points: this.points,
    content: this.content,
    evaluationConfig: this.evaluationConfig,
    explanation: this.explanation,
    status: this.status,
    version: this.version,
    createdBy: this.createdBy ? this.createdBy.toString() : null,
    updatedBy: this.updatedBy ? this.updatedBy.toString() : null,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Challenge = mongoose.model('Challenge', challengeSchema);
