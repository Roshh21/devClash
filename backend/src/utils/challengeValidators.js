import { CHALLENGE_TYPES, DIFFICULTIES } from '../models/Challenge.js';

// Difficulty → points, since there's no admin UI field for points yet
// (Stage C1/C2's schema requires the field to exist; nothing authors
// it by hand today). A simple, common competitive-programming default
// — easy to make explicitly admin-editable later without a schema
// change, since it's just the fallback when points isn't provided.
const POINTS_BY_DIFFICULTY = { Easy: 10, Medium: 20, Hard: 30 };

// Same reasoning as points: no admin UI for this yet, so every
// challenge gets a sensible per-type default that Stage D's real
// evaluators can read (and that a future settings UI can override).
function defaultEvaluationConfig(type) {
  switch (type) {
    case 'MCQ':
      return { scoringMode: 'exact-match' };
    case 'Output':
      return { comparison: 'normalized', trimWhitespace: true, caseSensitive: true };
    case 'SQL':
      return { dialect: 'postgresql' };
    case 'Coding':
    case 'Debugging':
    default:
      return { language: 'javascript', timeLimitMs: 5000, memoryLimitMb: 256 };
  }
}

// The admin form only ever collects a free-text "estimated time"
// (e.g. "20 min", matching frontend/src/lib/mockChallenges.js's
// existing data) — this pulls the first number out of it rather than
// requiring a form redesign to collect a plain number. Also accepts a
// bare number directly, in case a future caller sends one.
function parseTimeLimitMinutes(raw) {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.round(raw);
  }
  if (typeof raw !== 'string') return null;
  const match = raw.match(/(\d+)/);
  if (!match) return null;
  const value = Number.parseInt(match[1], 10);
  return value > 0 ? value : null;
}

function str(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Validates the flat payload shape the Stage A12 admin form actually
// sends (title/type/category/difficulty/estimatedTime/description
// plus whichever type-specific fields apply) and, if valid, reshapes
// it into { content, ... } ready for Challenge.create/save. Mirrors
// frontend/src/pages/AdminChallengeFormPage.jsx's own validate()
// closely on purpose — the same challenge should never be accepted
// client-side and rejected server-side, or vice versa.
//
// Returns { errors: null, data } on success, or { errors, data: null }
// with one message per invalid field (matching the frontend's error
// shape) on failure.
export function validateChallengeInput(body = {}) {
  const errors = {};

  const title = str(body.title);
  const type = body.type;
  const category = str(body.category);
  const difficulty = body.difficulty;
  const description = str(body.description);

  if (!title) errors.title = 'Title is required';
  if (!CHALLENGE_TYPES.includes(type)) errors.type = 'Select a valid challenge type';
  if (!category) errors.category = 'Select a category';
  if (!DIFFICULTIES.includes(difficulty)) errors.difficulty = 'Select a valid difficulty';
  if (!description) errors.description = 'Description is required';

  const timeLimitMinutes = parseTimeLimitMinutes(body.estimatedTime ?? body.timeLimitMinutes);
  if (!timeLimitMinutes) {
    errors.estimatedTime = "Estimated time must include a number of minutes, e.g. '20 min'";
  }

  let content = null;

  if (type === 'MCQ') {
    const options = Array.isArray(body.options) ? body.options.map(str) : [];
    const correctOptionIndex = Number.isInteger(body.correctOption) ? body.correctOption : -1;
    if (options.length !== 4 || options.some((o) => !o)) {
      errors.options = 'Fill in all four options';
    } else if (correctOptionIndex < 0 || correctOptionIndex > 3) {
      errors.options = 'Mark which option is correct';
    } else {
      content = { options, correctOptionIndex };
    }
  } else if (type === 'Output') {
    const codeSnippet = str(body.codeSnippet);
    const expectedOutput = str(body.expectedOutput);
    if (!codeSnippet) errors.codeSnippet = 'Code snippet is required';
    if (!expectedOutput) errors.expectedOutput = 'Expected output is required';
    if (codeSnippet && expectedOutput) content = { codeSnippet, expectedOutput };
  } else if (type === 'Debugging') {
    const buggyCode = str(body.buggyCode);
    const expectedFix = str(body.expectedFix);
    if (!buggyCode) errors.buggyCode = 'Buggy code is required';
    if (!expectedFix) errors.expectedFix = 'Describe the expected fix';
    if (buggyCode && expectedFix) content = { buggyCode, expectedFix };
  } else if (type === 'SQL') {
    const schema = str(body.schema);
    const expectedResult = str(body.expectedResult);
    if (!schema) errors.schema = 'Schema / setup is required';
    if (!expectedResult) errors.expectedResult = 'Expected result is required';
    if (schema && expectedResult) content = { schema, expectedResult };
  } else if (type === 'Coding') {
    const starterCode = str(body.starterCode);
    const testCases = Array.isArray(body.testCases)
      ? body.testCases.map((tc) => ({ input: str(tc?.input), expected: str(tc?.expected) }))
      : [];
    if (!starterCode) errors.starterCode = 'Starter code is required';
    if (testCases.length === 0 || testCases.some((t) => !t.input || !t.expected)) {
      errors.testCases = 'Fill in every test case field';
    }
    if (starterCode && testCases.length > 0 && !errors.testCases) {
      content = { starterCode, testCases };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, data: null };
  }

  return {
    errors: null,
    data: {
      title,
      type,
      category,
      difficulty,
      description,
      timeLimitMinutes,
      content,
      points: POINTS_BY_DIFFICULTY[difficulty],
      evaluationConfig: defaultEvaluationConfig(type),
    },
  };
}
