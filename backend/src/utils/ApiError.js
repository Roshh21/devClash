// A thrown ApiError carries everything errorHandler.js needs to shape
// a clean JSON response — a status code, a human message, and
// optionally per-field validation errors the frontend's <Input>
// components can render inline (matching Stage A3/B2's error shape).
export class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
