import { UserDetails } from "./user-details.type.js";

type UserUpdate = Pick<UserDetails, "firstName" | "lastName">;

export { type UserUpdate };
