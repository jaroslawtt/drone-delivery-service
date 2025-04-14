import { type AuthToken } from "./auth-token.type.js";

type AuthAccessToken = {
  type: "access";
} & AuthToken;

export { type AuthAccessToken };
