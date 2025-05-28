import { type ValueOf } from "~/libs/types/types.js";
import { drones } from "../../drone.schema.js";
import { DroneStatus } from "../enums/enums.js";

type DroneUpdate = Omit<
  typeof drones.$inferInsert,
  "id" | "createdAt" | "updatedAt"
> & {
  status: ValueOf<typeof DroneStatus>;
};

export { type DroneUpdate };
