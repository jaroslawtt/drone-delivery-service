import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ZodSchema } from "zod";
import { ROUTE_BODY_VALIDATION_SCHEMA_KEY } from "./validation.js";

const BodyValidationSchema = (schema: ZodSchema) => {
  return applyDecorators(SetMetadata(ROUTE_BODY_VALIDATION_SCHEMA_KEY, schema));
};

export { BodyValidationSchema };
