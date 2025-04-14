import { UserDetails } from "./user-details.type.js";
import { User } from "./user.type.js";

type UserEntityPayload = Pick<User, "id" | "email"> &
  Pick<UserDetails, "firstName" | "lastName">;

export { type UserEntityPayload };
