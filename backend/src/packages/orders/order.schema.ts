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

const orderStatusEnum = pgEnum(
  "order_status",
  Object.values(OrderStatus) as [string, ...string[]],
);

const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  clientId: integer("client_id")
    .references(() => users.id)
    .notNull(),
  droneId: integer("drone_id").references(() => drones.id),
  weight: decimal("weight", {
    precision: 8,
    scale: 3,
  }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum().$type<ValueOf<typeof OrderStatus>>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export { orders, orderStatusEnum };
