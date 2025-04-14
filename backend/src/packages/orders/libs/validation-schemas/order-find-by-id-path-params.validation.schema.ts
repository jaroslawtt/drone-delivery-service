import { z } from "zod";
import { OrderPathParamsValidationMessage } from "../enums/enums.js";

const orderIdPathParam = z.object({
  orderId: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: OrderPathParamsValidationMessage.VALID_ORDER_ID,
    }),
});

export { orderIdPathParam };
