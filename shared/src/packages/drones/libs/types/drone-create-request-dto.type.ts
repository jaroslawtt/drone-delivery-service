import { z } from "zod";
import { droneCreateItemValidationSchema } from "../validation-schemas/validation-schemas";

type DroneCreateRequestDto = z.infer<typeof droneCreateItemValidationSchema>;

export { DroneCreateRequestDto };
