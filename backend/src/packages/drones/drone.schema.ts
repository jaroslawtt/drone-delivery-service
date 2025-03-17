import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { DroneStatus } from "./libs/enums/enums.js";
import { ValueOf } from "~/libs/types/types.js";

const droneStatus = pgEnum(
  "drone_status",
  Object.values(DroneStatus) as [string, ...string[]],
);

const drones = pgTable("drones", {
  id: serial("id").primaryKey(),
  serialNumber: varchar("serial_number", { length: 155 }).notNull().unique(),
  status: droneStatus()
    .$type<ValueOf<typeof DroneStatus>>()
    .notNull()
    .default(DroneStatus.OFFLINE),
  batteryLevel: integer("battery_level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export { drones, droneStatus };
