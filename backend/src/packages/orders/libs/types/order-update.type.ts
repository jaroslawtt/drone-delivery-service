import { type Order } from "./order.type.js";

type OrderUpdate = Omit<
  Order,
  "createdAt" | "updatedAt" | "id" | "entryPointId" | "destinationId"
>;

export { OrderUpdate };
