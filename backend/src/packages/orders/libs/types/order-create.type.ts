import { orders } from "../../order.schema.js";

type OrderCreate = Pick<typeof orders.$inferInsert, "weight" | "clientId">;

export { type OrderCreate };
