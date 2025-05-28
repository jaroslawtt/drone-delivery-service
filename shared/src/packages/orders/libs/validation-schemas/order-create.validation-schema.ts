import { z } from "zod";
import { OrderValidationMessage } from "../enums/order-validation-message.enum.js";

const orderCreate = z.object({
  weight: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: OrderValidationMessage.WEIGHT_TO_BE_VALID_NUMBER,
    })
    .refine((val) => parseFloat(val) >= 0, {
      message: OrderValidationMessage.WEIGHT_TO_BE_NON_NEGATIVE,
    })
    .refine((val) => parseFloat(val) <= 1000, {
      message: OrderValidationMessage.WEIGHT_TO_BE_LESS_THAN_OR_EQUAL_TO_1000,
    }),
  entryPoint: z.object({
    longitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: OrderValidationMessage.PROVIDE_VALIDE__COORDINATES,
    }),
    latitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: OrderValidationMessage.PROVIDE_VALIDE__COORDINATES,
    }),
  }),
  destination: z.object({
    longitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: OrderValidationMessage.PROVIDE_VALIDE__COORDINATES,
    }),
    latitude: z.string().refine((val) => !isNaN(parseFloat(val)), {
      message: OrderValidationMessage.PROVIDE_VALIDE__COORDINATES,
    }),
  }),
});

export { orderCreate };
