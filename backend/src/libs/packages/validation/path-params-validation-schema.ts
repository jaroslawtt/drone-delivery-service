import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ZodSchema } from "zod";
import { ROUTE_PARAMS_VALIDATION_SCHEMA_KEY } from "./validation.js";

const PathParamsValidationSchema = (schema: ZodSchema) => {
  return applyDecorators(
    SetMetadata(ROUTE_PARAMS_VALIDATION_SCHEMA_KEY, schema),
  );
};

export { PathParamsValidationSchema };
