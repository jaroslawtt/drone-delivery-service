import { z } from "zod";

const droneCreateItem = z.object({
  serialNumber: z
    .string()
    .min(1, { message: "Serial number is required." })
    .max(50, { message: "Serial number must be 50 characters or less." })
    .regex(/^[A-Z0-9-]+$/, {
      message:
        "Serial number can only contain uppercase letters, numbers, and hyphens.",
    }),
  model: z
    .string()
    .min(1, { message: "Model is required." })
    .max(50, { message: "Model must be 50 characters or less." }),
});

export { droneCreateItem };
