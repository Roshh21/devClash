// Mirrors the client-side rules in frontend/src/pages/AuthPage.jsx
// (email format, 8-char minimum password, required username) so the
// two never disagree about what's valid — the frontend catches most
// mistakes before a request is even sent, and this is the real,
// unbypassable check.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export function validateSignup({ username, email, password } = {}) {
  const errors = {};

  if (!username || !username.trim()) {
    errors.username = 'Username is required';
  } else if (!USERNAME_REGEX.test(username.trim())) {
    errors.username = '3–20 characters: letters, numbers, and underscores only';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
}

export function validateLogin({ email, password } = {}) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email is required';
  }
  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
}
