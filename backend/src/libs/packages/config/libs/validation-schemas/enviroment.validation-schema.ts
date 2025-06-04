import { z } from "zod";

const environment = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET_KEY: z.string().min(1),
  AUTH_ALGORITHM: z.string(),
  REFRESH_TOKEN_EXPIRATION_TIME: z.string().regex(/^\d+[hdwmy]$/),
  ACCESS_TOKEN_EXPIRATION_TIME: z.string().regex(/^\d+[hdwmy]$/),
  USER_PASSWORD_SALT_ROUNDS: z.coerce.number().int().min(1).max(20),
  PORT: z.coerce.number().int().positive(),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().positive()
});

export { environment };
