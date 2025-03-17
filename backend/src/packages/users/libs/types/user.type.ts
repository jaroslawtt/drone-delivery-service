import { users } from "~/packages/users/user.schema.js";

type User = typeof users.$inferSelect;

export { type User };
