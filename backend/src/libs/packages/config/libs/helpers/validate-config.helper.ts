import { enviromentValidationSchema } from "../validation-schemas/validation-schemas.js";

const validateConfig = (config: Record<string, unknown>) => {
  const parsed = enviromentValidationSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error("Invalid configuration");
  }

  return parsed.data;
};

export { validateConfig };
