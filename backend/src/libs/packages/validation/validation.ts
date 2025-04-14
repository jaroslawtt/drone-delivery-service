const ROUTE_BODY_VALIDATION_SCHEMA_KEY = Symbol("ROUTE_BODY_VALIDATION_SCHEMA");
const ROUTE_PARAMS_VALIDATION_SCHEMA_KEY = Symbol(
  "ROUTE_PARAMS_VALIDATION_SCHEMA",
);

export { ROUTE_BODY_VALIDATION_SCHEMA_KEY, ROUTE_PARAMS_VALIDATION_SCHEMA_KEY };
export { BodyValidationSchema } from "./body-validation-schema.decorator.js";
export { PathParamsValidationSchema } from "./path-params-validation-schema.js";
