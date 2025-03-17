import { User } from "./user.type.js";

type UserPrivateDataPayload = Pick<User, "passwordHash" | "passwordSalt">;

export { type UserPrivateDataPayload };
