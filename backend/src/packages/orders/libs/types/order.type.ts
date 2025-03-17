import { orders } from "../../order.schema.js";

type Order = typeof orders.$inferSelect;

export { type Order };
