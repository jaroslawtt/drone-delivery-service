import { Order } from "./order.type";

type OrderUpdate = Omit<Order, "createdAt" | "updatedAt" | "id">;

export { OrderUpdate };
