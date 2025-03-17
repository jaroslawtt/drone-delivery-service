import { droneLocation } from "../../drone-location.schema.js";

type DroneUpdateLocation = Required<
  Omit<typeof droneLocation.$inferSelect, "droneId" | "updatedAt">
>;

export { type DroneUpdateLocation };
