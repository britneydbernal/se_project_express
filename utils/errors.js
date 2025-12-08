module.exports = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,

  MESSAGES: {
    SERVER_ERROR: "An error has occurred on the server.",
    BAD_REQUEST: "Invalid request data.",
    UNAUTHORIZED: "Authentication is required.",
    FORBIDDEN: "You do not have permission.",
    NOT_FOUND: "Resource not found.",
    CONFLICT: "User with this email already exists.",
  },
};
