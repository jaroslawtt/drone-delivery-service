import * as z from "zod";
import { authSignUpValidationSchema } from "../validation-schemas/validation-schemas.js";

type AuthSignUpRequestDto = z.infer<typeof authSignUpValidationSchema>;

export { type AuthSignUpRequestDto };
