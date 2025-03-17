import { z } from "zod";
import { orderCalculateAmountValidationSchema } from "../validation-schemas/validation-schemas.js";

type OrderCalculateAmountRequestDto = z.infer<
  typeof orderCalculateAmountValidationSchema
>;

export { type OrderCalculateAmountRequestDto };
