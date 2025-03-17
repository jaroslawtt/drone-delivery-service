import { userDetails } from "~/packages/users/user-details.schema.js";
import { users } from "~/packages/users/user.schema.js";

type UserCreate = Omit<
  typeof users.$inferInsert & typeof userDetails.$inferInsert,
  "userId"
>;

export { type UserCreate };
