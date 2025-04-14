const UserValidationMessage = {
  EMAIL_REQUIRED: "Email is required",
  EMAIL_INVALID_TYPE: "Email must be a string",
  EMAIL_INVALID: "Invalid email address",

  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_INVALID_TYPE: "Password must be a string",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
  PASSWORD_MAX_LENGTH: "Password must not exceed 50 characters",
  PASSWORD_REGEX:
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",

  FIRST_NAME_REQUIRED: "First name is required",
  FIRST_NAME_INVALID_TYPE: "First name must be a string",
  FIRST_NAME_MIN_LENGTH: "First name must be at least 2 characters long",
  FIRST_NAME_MAX_LENGTH: "First name must not exceed 50 characters",

  LAST_NAME_REQUIRED: "Last name is required",
  LAST_NAME_INVALID_TYPE: "Last name must be a string",
  LAST_NAME_MIN_LENGTH: "Last name must be at least 2 characters long",
  LAST_NAME_MAX_LENGTH: "Last name must not exceed 50 characters",
} as const;

export { UserValidationMessage };
