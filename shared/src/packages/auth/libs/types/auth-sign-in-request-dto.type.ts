import { z } from "zod";
import { authSignInValidationSchema } from "../validation-schemas/validation-schemas.js";

type AuthSignInRequestDto = z.infer<typeof authSignInValidationSchema>;

export { type AuthSignInRequestDto };
