import { type User } from "~/packages/users/users.js";

type AuthToken = {
  userId: User["id"];
};

export { type AuthToken };
