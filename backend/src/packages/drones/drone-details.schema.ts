import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { drones } from "./drone.schema.js";

const droneDetails = pgTable("drone_details", {
  id: serial("id").primaryKey(),
  droneId: integer("drone_id")
    .notNull()
    .references(() => drones.id, {
      onDelete: "cascade",
    })
    .unique(),
  model: varchar("model", { length: 100 }),
  maxSpeed: decimal("max_speed", { precision: 5, scale: 2 }),
  maxAltitude: decimal("max_altitude", { precision: 7, scale: 2 }),
  batteryCapacity: decimal("battery_capacity", { precision: 5, scale: 2 }),
  weightCapacity: decimal("weight_capacity", { precision: 8, scale: 3 }),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export { droneDetails };
