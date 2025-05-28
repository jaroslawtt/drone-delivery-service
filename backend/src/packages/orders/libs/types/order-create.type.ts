import { map } from "~/packages/map/map.js";
import { orders } from "../../order.schema.js";

type OrderCreate = Pick<typeof orders.$inferInsert, "weight" | "clientId"> & {
  destination: Omit<typeof map.$inferSelect, "id" | "createdAt">;
  entryPoint: Omit<typeof map.$inferSelect, "id" | "createdAt">;
};

export { type OrderCreate };
