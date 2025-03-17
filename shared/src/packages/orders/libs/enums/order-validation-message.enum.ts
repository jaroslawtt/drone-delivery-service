const OrderValidationMessage = {
  WEIGHT_TO_BE_VALID_NUMBER: "Weight must be a valid number",
  WEIGHT_TO_BE_NON_NEGATIVE: "Weight must be non-negative",
  WEIGHT_TO_BE_LESS_THAN_OR_EQUAL_TO_1000:
    "Weight exceeds maximum allowed value",
} as const;

export { OrderValidationMessage };
