import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { drones } from "./drone.schema.js";

const droneLocation = pgTable("drones_locations", {
  id: serial("id").primaryKey(),
  droneId: integer("drone_id")
    .notNull()
    .references(() => drones.id, {
      onDelete: "cascade",
    })
    .unique(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  altitude: decimal("altitude", { precision: 7, scale: 2 }),
  speed: decimal("speed", { precision: 5, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export { droneLocation };
