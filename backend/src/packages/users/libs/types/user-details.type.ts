import { userDetails } from "~/packages/users/user-details.schema.js";

type UserDetails = typeof userDetails.$inferSelect;

export { type UserDetails };
