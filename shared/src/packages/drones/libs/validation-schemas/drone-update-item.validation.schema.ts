import { z } from "zod";
import { DroneStatus } from "../enums/enums.js";

const droneUpdateItem = z.object({
  serialNumber: z
    .string()
    .min(1)
    .max(20)
    .regex(/^[A-Z0-9-]+$/),
  model: z.string().min(1).max(50),
  status: z.nativeEnum(DroneStatus),
});

export { droneUpdateItem };
