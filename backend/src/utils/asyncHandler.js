// Wraps an async Express handler so a rejected promise (a thrown
// ApiError, a Mongoose error, anything) is forwarded to next()
// instead of crashing the process or hanging the request.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
