import { relations } from "drizzle-orm";
import { droneDetails } from "~/packages/drones/drone-details.schema.js";
import { droneLocation } from "~/packages/drones/drone-location.schema.js";
import { drones } from "~/packages/drones/drone.schema.js";
import { orders } from "~/packages/orders/orders.js";
import { userDetails } from "~/packages/users/user-details.schema.js";
import { users } from "~/packages/users/user.schema.js";

const usersRelations = relations(users, ({ one, many }) => ({
  userDetails: one(userDetails, {
    fields: [users.id],
    references: [userDetails.userId],
  }),
  orders: many(orders),
}));

const ordersRelation = relations(orders, ({ one }) => ({
  client: one(users, {
    fields: [orders.clientId],
    references: [users.id],
  }),
}));

const dronesRelations = relations(drones, ({ one }) => ({
  droneDetails: one(droneDetails, {
    fields: [drones.id],
    references: [droneDetails.droneId],
  }),
  droneLocation: one(droneLocation, {
    fields: [drones.id],
    references: [droneLocation.droneId],
  }),
}));

export * from "~/packages/users/user-details.schema.js";
export * from "~/packages/users/user.schema.js";
export * from "~/packages/orders/order.schema.js";
export * from "~/packages/drones/drone.schema.js";
export * from "~/packages/drones/drone-details.schema.js";
export * from "~/packages/drones/drone-location.schema.js";

export { ordersRelation, usersRelations, dronesRelations };
