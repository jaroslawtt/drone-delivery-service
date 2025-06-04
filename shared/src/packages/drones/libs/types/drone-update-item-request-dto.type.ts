import { z } from "zod";
import { droneUpdateItemValidationSchema } from "../validation-schemas/validation-schemas.js";

type DroneUpdateItemRequestDto = z.infer<
  typeof droneUpdateItemValidationSchema
>;

export { type DroneUpdateItemRequestDto };
