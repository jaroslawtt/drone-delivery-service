import {
  pgTable,
  serial,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { OrderStatus } from "./libs/enums/enums.js";
import { type ValueOf } from "~/libs/types/types.js";
import { users } from "~/packages/users/users.js";
import { drones } from "~/packages/drones/drones.js";
import { map } from "../map/map.schema.js";

const orderStatusEnum = pgEnum(
  "order_status",
  Object.values(OrderStatus) as [string, ...string[]],
);

const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  droneId: integer("drone_id")
    .references(() => drones.id)
    .unique(),
  weight: decimal("weight", {
    precision: 8,
    scale: 3,
  }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum().$type<ValueOf<typeof OrderStatus>>().notNull(),
  destinationId: integer("destination_id")
    .references(() => map.id)
    .notNull(),
  entryPointId: integer("entry_point_id")
    .references(() => map.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export { orders, orderStatusEnum };
