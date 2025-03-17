import { z } from "zod";
import { orderCreateValidationSchema } from "../validation-schemas/validation-schemas.js";

type OrderCreateRequestDto = z.infer<typeof orderCreateValidationSchema>;

export { type OrderCreateRequestDto };
