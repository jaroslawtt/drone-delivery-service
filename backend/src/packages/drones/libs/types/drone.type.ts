import { drones } from "../../drone.schema.js";

type Drone = typeof drones.$inferSelect;

export { type Drone };
